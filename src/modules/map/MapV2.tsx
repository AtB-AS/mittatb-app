import {
  getCurrentCoordinatesGlobal,
  useGeolocationContext,
} from '@atb/modules/geolocation';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import MapboxGL, {LocationPuck} from '@rnmapbox/maps';
import {Feature, GeoJsonProperties, Geometry, Position} from 'geojson';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
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
  isStopPlace,
  isParkAndRide,
  isClusterFeatureV2,
  isQuayFeature,
  mapPositionToCoordinates,
  flyToLocation,
  getMapPadding,
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
  isCarStationV2,
  isStationV2,
  isVehiclesClusteredFeature,
  MapFilter,
} from '@atb/modules/mobility';

import {Snackbar, useSnackbar} from '@atb/components/snackbar';
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

export const MapV2 = (props: MapProps) => {
  const {initialLocation, includeSnackbar} = props;
  const {getCurrentCoordinates} = useGeolocationContext();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  const {autoSelectedFeature, mapFilter, mapFilterIsOpen} = useMapContext();

  const bottomTabBarHeight = useBottomTabBarHeight();
  const tabBarHeight = mapFilterIsOpen ? 0 : bottomTabBarHeight; // not great, state management refactor incoming
  const controlStyles = useControlPositionsStyle(false, tabBarHeight);
  const isFocused = useIsFocused();

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

  const showVehicles = mapFilter?.mobility.SCOOTER?.showAll ?? false;
  const showStations =
    (mapFilter?.mobility.BICYCLE?.showAll ||
      mapFilter?.mobility.CAR?.showAll) ??
    false;
  const shouldShowVehiclesAndStations =
    isFocused && (showVehicles || showStations); // don't send tile requests while in the background, and always get fresh data upon enter
  const mapViewConfig = useMapViewConfig({shouldShowVehiclesAndStations});

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
    (!selectedFeature || selectedFeatureIsAVehicle);

  useAutoSelectMapItem(
    mapCameraRef,
    mapViewRef,
    onReportParkingViolation,
    tabBarHeight,
  );

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
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          pitchEnabled={false}
          onPress={onFeatureClick}
          testID="mapView"
          {...mapViewConfig}
        >
          <MapboxGL.Camera
            ref={mapCameraRef}
            zoomLevel={15}
            centerCoordinate={[
              startingCoordinates.longitude,
              startingCoordinates.latitude,
            ]}
            {...MapCameraConfig}
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

          <SelectedFeatureIcon selectedFeature={selectedFeature} />

          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
          {shouldShowVehiclesAndStations && (
            <VehiclesAndStations
              selectedFeatureId={selectedFeature?.properties?.id}
              onPress={onMapItemClick}
              showVehicles={showVehicles}
              showStations={showStations}
            />
          )}
        </MapboxGL.MapView>
        <View
          style={[
            controlStyles.mapButtonsContainer,
            controlStyles.mapButtonsContainerRight,
          ]}
        >
          <ExternalRealtimeMapButton onMapClick={onMapClick} />

          <MapFilter
            onPress={() => onMapClick({source: 'filters-button'})}
            isLoading={false}
          />

          <PositionArrow
            onPress={async () => {
              const coordinates = await getCurrentCoordinates(true);
              if (coordinates) {
                flyToLocation({
                  coordinates: coordinates,
                  padding: getMapPadding(tabBarHeight),
                  mapCameraRef,
                  mapViewRef,
                  zoomLevel: 15,
                });
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

function getFeatureToSelect(
  featuresAtClick: Feature<Geometry, GeoJsonProperties>[],
  positionClicked: Position, // [lon, lat]
) {
  const featureToSelect = featuresAtClick.reduce((selected, currentFeature) =>
    getFeatureWeight(currentFeature, positionClicked) >
    getFeatureWeight(selected, positionClicked)
      ? currentFeature
      : selected,
  );
  return featureToSelect;
}

function getFeatureWeight(feature: Feature, positionClicked: Position): number {
  if (isFeaturePoint(feature)) {
    return isStopPlace(feature) ||
      isVehiclesClusteredFeature(feature) ||
      isScooterV2(feature) ||
      isBicycleV2(feature) ||
      isStationV2(feature) ||
      isCarStationV2(feature) ||
      isParkAndRide(feature)
      ? 3
      : 1;
  } else if (isFeatureGeofencingZone(feature)) {
    const positionClickedIsInsideGeofencingZone = turfBooleanPointInPolygon(
      positionClicked,
      feature.geometry,
    );
    return positionClickedIsInsideGeofencingZone ? 2 : 0;
  } else {
    return 0;
  }
}
