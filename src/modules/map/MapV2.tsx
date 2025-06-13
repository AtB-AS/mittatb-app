import {
  getCurrentCoordinatesGlobal,
  useGeolocationContext,
} from '@atb/modules/geolocation';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {
  LocationPuck,
  UserTrackingMode,
  Viewport,
  Camera,
  MapView,
} from '@rnmapbox/maps';
import {Feature} from 'geojson';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {MapCameraConfig} from './MapConfig';
import {PositionArrow} from './components/PositionArrow';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import {useAutoSelectMapItem} from './hooks/use-auto-select-map-item';
import {GeofencingZoneCustomProps, MapProps} from './types';

import {
  isFeaturePoint,
  getFeaturesAtClick,
  isFeatureGeofencingZone,
  isClusterFeatureV2,
  isQuayFeature,
  mapPositionToCoordinates,
  flyToLocation,
  getMapPadding,
  getFeatureToSelect,
} from './utils';
import {
  GeofencingZones,
  useGeofencingZoneTextContent,
  useMapViewConfig,
} from '@atb/modules/map';
import {ExternalRealtimeMapButton} from './components/external-realtime-map/ExternalRealtimeMapButton';

import {
  isBicycleV2,
  isScooterV2,
  useInitShmoBookingMutationStatus,
} from '@atb/modules/mobility';

import {Snackbar, useSnackbar, useStableValue} from '@atb/components/snackbar';
import {ScanButton} from './components/ScanButton';
import {useActiveShmoBookingQuery} from '@atb/modules/mobility';
import {useMapContext} from '@atb/modules/map';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {NationalStopRegistryFeatures} from './components/national-stop-registry-features';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {VehiclesAndStations} from './components/mobility/VehiclesAndStations';
import {useIsFocused} from '@react-navigation/native';
import {useShmoActiveBottomSheet} from './hooks/use-active-shmo-booking';
import {SelectedFeatureIcon} from './components/SelectedFeatureIcon';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useStablePreviousValue} from '@atb/utils/use-stable-previous-value';

const DEFAULT_ZOOM_LEVEL = 14.5;

export const MapV2 = (props: MapProps) => {
  const {initialLocation, includeSnackbar} = props;
  const {getCurrentCoordinates} = useGeolocationContext();
  const mapCameraRef = useRef<Camera>(null);
  const mapViewRef = useRef<MapView>(null);
  const tabBarHeight = useBottomTabBarHeight();
  const controlStyles = useControlPositionsStyle(false, tabBarHeight);
  const isFocused = useIsFocused();
  const shouldShowVehiclesAndStations = isFocused; // don't send tile requests while in the background, and always get fresh data upon enter
  const mapViewConfig = useMapViewConfig({shouldShowVehiclesAndStations});
  const {isMutating: initShmoOneStopBookingIsMutating} =
    useInitShmoBookingMutationStatus();

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : getCurrentCoordinatesGlobal() || FOCUS_ORIGIN,
    [initialLocation],
  );

  const {
    onMapClick,
    selectedFeature: mapSelectionSelectedFeature,
    onReportParkingViolation,
    closeCallback: mapSelectionCloseCallback,
  } = useMapSelectionChangeEffect(
    props,
    mapViewRef,
    mapCameraRef,
    startingCoordinates,
    true,
    true,
    tabBarHeight,
  );

  const {autoSelectedFeature} = useMapContext();
  const selectedFeature = mapSelectionSelectedFeature || autoSelectedFeature;

  const selectedFeatureIsAVehicle =
    isScooterV2(selectedFeature) || isBicycleV2(selectedFeature);

  const {
    isGeofencingZonesEnabled,
    isShmoDeepIntegrationEnabled,
    isMapV2Enabled,
  } = useFeatureTogglesContext();

  const showGeofencingZones =
    isGeofencingZonesEnabled && selectedFeatureIsAVehicle;

  useShmoActiveBottomSheet(
    mapCameraRef,
    mapViewRef,
    mapSelectionCloseCallback,
    tabBarHeight,
  );

  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
  const {snackbarProps, showSnackbar, hideSnackbar} = useSnackbar();

  const {data: activeShmoBooking, isLoading: activeShmoBookingIsLoading} =
    useActiveShmoBookingQuery();

  const showScanButton =
    isShmoDeepIntegrationEnabled &&
    isMapV2Enabled &&
    !activeShmoBooking &&
    !activeShmoBookingIsLoading &&
    (!selectedFeature || selectedFeatureIsAVehicle) &&
    !initShmoOneStopBookingIsMutating;

  useAutoSelectMapItem(
    mapCameraRef,
    mapViewRef,
    onReportParkingViolation,
    tabBarHeight,
  );

  const [followUserLocation, setFollowUserLocation] = useState(false);
  const stablePreviousActiveShmoBooking =
    useStablePreviousValue(activeShmoBooking);
  const stableActiveShmoBooking = useStableValue(activeShmoBooking);
  useEffect(() => {
    if (
      !stablePreviousActiveShmoBooking &&
      stableActiveShmoBooking &&
      stableActiveShmoBooking.state === ShmoBookingState.IN_USE
    ) {
      setFollowUserLocation(true);
    }
  }, [stableActiveShmoBooking, stablePreviousActiveShmoBooking]);

  useEffect(() => {
    // hide the snackbar when the bottom sheet is closed
    !selectedFeature && hideSnackbar();
  }, [selectedFeature, hideSnackbar]);

  const geofencingZoneOnPress = useCallback(
    (geofencingZoneCustomProps?: GeofencingZoneCustomProps) => {
      const textContent = getGeofencingZoneTextContent(
        geofencingZoneCustomProps,
      );
      showSnackbar({textContent, position: 'top'});
    },
    [showSnackbar, getGeofencingZoneTextContent],
  );

  /**
   * As setting onPress on the GeofencingZones ShapeSource prevents MapView's onPress
   * from being triggered, the onPress logic is handled here instead.
   * This makes it possible to click directly on e.g. bus stops while GeofencingZones are visible.
   * Step 1: query all rendered features
   * Step 2: decide feature to select
   * Step 3: selected the feature
   */
  const onFeatureClick = useCallback(
    async (feature: Feature) => {
      const isActiveTrip = activeShmoBooking?.state === ShmoBookingState.IN_USE;
      if (!isFeaturePoint(feature)) return;

      if (!showGeofencingZones && !isActiveTrip) {
        onMapClick({source: 'map-click', feature});
        return;
      }

      const {coordinates: positionClicked} = feature.geometry;

      const featuresAtClick = await getFeaturesAtClick(feature, mapViewRef);
      if (!featuresAtClick || featuresAtClick.length === 0) return;
      const featureToSelect = getFeatureToSelect(
        featuresAtClick,
        positionClicked,
      );

      /**
       * this hides the Snackbar when a feature is clicked,
       * unless the feature is a geofencingZone, in which case
       * geofencingZoneOnPress will be called which sets it visible again
       */
      hideSnackbar();

      if (isQuayFeature(featureToSelect) && !isActiveTrip) {
        // In this case we might want to either
        // - select a stop place with the clicked quay sorted on top
        // - have a bottom sheet with departures just for the clicked quay
        return; // currently - do nothing
      } else if (isFeatureGeofencingZone(featureToSelect)) {
        geofencingZoneOnPress(
          featureToSelect?.properties?.geofencingZoneCustomProps,
        );
      } else {
        if (isFeaturePoint(featureToSelect) && !isActiveTrip) {
          onMapClick({
            source: 'map-click',
            feature: featureToSelect,
          });
        } else if (isScooterV2(selectedFeature) && !isActiveTrip) {
          // outside of operational area, rules unspecified
          geofencingZoneOnPress(undefined);
        }
      }
    },
    [
      hideSnackbar,
      showGeofencingZones,
      onMapClick,
      geofencingZoneOnPress,
      selectedFeature,
      activeShmoBooking,
    ],
  );

  const onMapItemClick = useCallback(
    async (e: OnPressEvent) => {
      const positionClicked = [e.coordinates.longitude, e.coordinates.latitude];
      const featuresAtClick = e.features;
      if (
        !featuresAtClick ||
        featuresAtClick.length === 0 ||
        activeShmoBooking?.state === ShmoBookingState.IN_USE
      )
        return;
      const featureToSelect = getFeatureToSelect(
        featuresAtClick,
        positionClicked,
      );
      if (isClusterFeatureV2(featureToSelect)) {
        const fromZoomLevel = (await mapViewRef.current?.getZoom()) ?? 0;
        const toZoomLevel = Math.max(fromZoomLevel + 2);

        flyToLocation({
          coordinates: mapPositionToCoordinates(
            featureToSelect.geometry.coordinates,
          ),
          padding: getMapPadding(tabBarHeight),
          mapCameraRef,
          mapViewRef,
          zoomLevel: toZoomLevel,
        });
      } else if (isFeaturePoint(featureToSelect)) {
        if (isQuayFeature(featureToSelect)) return;
        // use isVehicleFeature here?
        onMapClick({
          source: 'map-item',
          feature: featureToSelect,
        });
      }
    },
    [activeShmoBooking?.state, tabBarHeight, onMapClick],
  );

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          pitchEnabled={false}
          onPress={onFeatureClick}
          testID="mapView"
          {...mapViewConfig}
        >
          <Viewport
            onStatusChanged={(status) => {
              if (status.to.kind === 'idle') {
                setFollowUserLocation(false);
              }
            }}
          />
          <Camera
            ref={mapCameraRef}
            zoomLevel={DEFAULT_ZOOM_LEVEL}
            centerCoordinate={[
              startingCoordinates.longitude,
              startingCoordinates.latitude,
            ]}
            {...MapCameraConfig}
            followUserLocation={
              !!activeShmoBooking &&
              activeShmoBooking.state === ShmoBookingState.IN_USE &&
              followUserLocation
            }
            followUserMode={UserTrackingMode.FollowWithHeading}
            followPadding={getMapPadding(tabBarHeight)}
          />
          {showGeofencingZones && (
            <GeofencingZones
              selectedVehicleId={selectedFeature?.properties?.id}
            />
          )}

          <NationalStopRegistryFeatures
            selectedFeaturePropertyId={selectedFeature?.properties?.id}
            onMapItemClick={onMapItemClick}
          />

          {!activeShmoBooking && (
            <SelectedFeatureIcon selectedFeature={selectedFeature} />
          )}

          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
          {shouldShowVehiclesAndStations && (
            <VehiclesAndStations
              selectedFeatureId={selectedFeature?.properties?.id}
              onPress={onMapItemClick}
              showVehicles={true}
              showStations={true}
            />
          )}
        </MapView>
        <View
          style={[
            controlStyles.mapButtonsContainer,
            controlStyles.mapButtonsContainerRight,
          ]}
        >
          <ExternalRealtimeMapButton onMapClick={onMapClick} />

          <PositionArrow
            onPress={async () => {
              const coordinates = await getCurrentCoordinates(true);
              if (
                activeShmoBooking &&
                activeShmoBooking.state === ShmoBookingState.IN_USE
              ) {
                setFollowUserLocation(true);
              } else {
                if (coordinates) {
                  flyToLocation({
                    coordinates,
                    padding: !selectedFeature
                      ? undefined
                      : getMapPadding(tabBarHeight),
                    mapCameraRef,
                    mapViewRef,
                    zoomLevel: DEFAULT_ZOOM_LEVEL + 2.5,
                  });
                }
              }
            }}
          />
        </View>
        {showScanButton && (
          <ScanButton
            onPressCallback={mapSelectionCloseCallback}
            tabBarHeight={tabBarHeight}
          />
        )}
        {includeSnackbar && <Snackbar {...snackbarProps} />}
      </View>
    </View>
  );
};
