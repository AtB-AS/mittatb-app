import {
  getCurrentCoordinatesGlobal,
  useGeolocationContext,
} from '@atb/modules/geolocation';
import {FOCUS_ORIGIN} from '@atb/api/bff/geocoder';
import {
  LocationPuck,
  UserTrackingMode,
  Viewport,
  Camera,
  MapView,
  MapState,
} from '@rnmapbox/maps';
import {Feature} from 'geojson';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {MapCameraConfig} from './MapConfig';
import {PositionArrow} from './components/PositionArrow';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {
  CameraFocusModeType,
  GeofencingZoneCustomProps,
  MapProps,
} from './types';

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
  findEntityAtClick,
  isParkAndRide,
  isStopPlace,
} from './utils';
import {
  GeofencingZones,
  MapStateActionType,
  useGeofencingZoneTextContent,
  useMapViewConfig,
} from '@atb/modules/map';
import {ExternalRealtimeMapButton} from './components/external-realtime-map/ExternalRealtimeMapButton';

import {
  isBicycleV2,
  isScooterV2,
  useInitShmoBookingMutationStatus,
  MapFilter,
  useVehicleQuery,
  isStationV2,
  isCarStationV2,
  isBikeStationV2,
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
import {SelectedFeatureIcon} from './components/SelectedFeatureIcon';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useStablePreviousValue} from '@atb/utils/use-stable-previous-value';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {MapBottomSheets} from './use-map-bottom-sheets';
import {useTriggerCameraMoveEffect} from './hooks/use-trigger-camera-move-effect';
import {getFocusMode} from './hooks/use-decide-camera-focus-mode';

const DEFAULT_ZOOM_LEVEL = 14.5;

export const MapV2 = (props: MapProps) => {
  const {initialLocation, includeSnackbar} = props;
  const {getCurrentCoordinates} = useGeolocationContext();
  const mapCameraRef = useRef<Camera>(null);
  const mapViewRef = useRef<MapView>(null);
  const {location: currentLocation} = useGeolocationContext();

  const [cameraFocusMode, setCameraFocusMode] = useState<CameraFocusModeType>();

  const {
    mapFilter,
    mapFilterIsOpen,
    setBottomSheetCurrentlyAutoSelected,
    setBottomSheetToAutoSelect,
    mapSelectionState,
    mapSelectionDispatch,
  } = useMapContext();
  const {height: bottomSheetHeight, close: closeBottomSheet} =
    useBottomSheetContext();
  const showMapFilterButton = bottomSheetHeight === 0; // hide filter button when a bottom sheet is open

  const tabBarHeight = useBottomTabBarHeight();
  const controlStyles = useControlPositionsStyle(false, tabBarHeight);
  const isFocused = useIsFocused();
  const {isMutating: initShmoOneStopBookingIsMutating} =
    useInitShmoBookingMutationStatus();

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : getCurrentCoordinatesGlobal() || FOCUS_ORIGIN,
    [initialLocation],
  );

  const mapSelectionCloseCallback = useCallback(() => {
    setBottomSheetCurrentlyAutoSelected(undefined);
    setBottomSheetToAutoSelect(undefined);
    closeBottomSheet();
    mapSelectionDispatch({type: MapStateActionType.None});
  }, [
    closeBottomSheet,
    mapSelectionDispatch,
    setBottomSheetCurrentlyAutoSelected,
    setBottomSheetToAutoSelect,
  ]);

  const showVehicles = mapFilter?.mobility.SCOOTER?.showAll ?? false;
  const showStations =
    (mapFilter?.mobility.BICYCLE?.showAll ||
      mapFilter?.mobility.CAR?.showAll) ??
    false;
  const shouldShowVehiclesAndStations =
    isFocused && (showVehicles || showStations); // don't send tile requests while in the background, and always get fresh data upon enter
  const mapViewConfig = useMapViewConfig({shouldShowVehiclesAndStations});

  const selectedFeature = mapSelectionState.feature;

  const selectedFeatureIsAVehicle =
    isScooterV2(selectedFeature) || isBicycleV2(selectedFeature);

  const {
    isGeofencingZonesEnabled,
    isShmoDeepIntegrationEnabled,
    isMapV2Enabled,
  } = useFeatureTogglesContext();

  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
  const {snackbarProps, showSnackbar, hideSnackbar} = useSnackbar();

  const {data: activeShmoBooking, isLoading: activeShmoBookingIsLoading} =
    useActiveShmoBookingQuery();

  const showGeofencingZones =
    isGeofencingZonesEnabled &&
    (selectedFeatureIsAVehicle ||
      (activeShmoBooking?.bookingId !== undefined &&
        activeShmoBooking.state === ShmoBookingState.IN_USE));

  const showScanButton =
    isShmoDeepIntegrationEnabled &&
    isMapV2Enabled &&
    !activeShmoBooking &&
    !activeShmoBookingIsLoading &&
    (!selectedFeature || selectedFeatureIsAVehicle) &&
    !initShmoOneStopBookingIsMutating &&
    !mapFilterIsOpen;

  const {
    data: vehicle,
    isLoading: vehicleIsLoading,
    isError: vehicleError,
  } = useVehicleQuery(selectedFeature?.properties?.id);

  const [followUserLocation, setFollowUserLocation] = useState(false);
  const mapStateRef = useRef<MapState | null>(null);

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

  useTriggerCameraMoveEffect(
    cameraFocusMode,
    mapCameraRef,
    mapViewRef,
    tabBarHeight,
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
      const isActiveTrip =
        activeShmoBooking?.state === ShmoBookingState.IN_USE ||
        activeShmoBooking?.state === ShmoBookingState.FINISHING;
      if (!isFeaturePoint(feature)) return;

      if (!showGeofencingZones && !isActiveTrip) {
        const entity = await findEntityAtClick(feature, mapViewRef);

        setCameraFocusMode(
          await getFocusMode(entity, currentLocation?.coordinates, true, true),
        );

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
          const entity = await findEntityAtClick(featureToSelect, mapViewRef);
          setCameraFocusMode(
            await getFocusMode(
              entity,
              currentLocation?.coordinates,
              true,
              true,
            ),
          );
        } else if (isScooterV2(selectedFeature) && !isActiveTrip) {
          // outside of operational area, rules unspecified
          geofencingZoneOnPress(undefined);
        }
      }
    },
    [
      activeShmoBooking?.state,
      showGeofencingZones,
      hideSnackbar,
      currentLocation?.coordinates,
      geofencingZoneOnPress,
      selectedFeature,
    ],
  );

  const onMapItemClick = useCallback(
    async (e: OnPressEvent) => {
      const positionClicked = [e.coordinates.longitude, e.coordinates.latitude];
      const featuresAtClick = e.features;
      if (
        !featuresAtClick ||
        featuresAtClick.length === 0 ||
        activeShmoBooking?.state === ShmoBookingState.IN_USE ||
        activeShmoBooking?.state === ShmoBookingState.FINISHING
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

        if (isScooterV2(featureToSelect)) {
          mapSelectionDispatch({
            type: MapStateActionType.Scooter,
            assetId: featureToSelect.properties.id,
            feature: featureToSelect,
          });
        } else if (isBicycleV2(featureToSelect)) {
          mapSelectionDispatch({
            type: MapStateActionType.Bicycle,
            assetId: featureToSelect.properties.id,
            feature: featureToSelect,
          });
        } else if (isCarStationV2(featureToSelect)) {
          mapSelectionDispatch({
            type: MapStateActionType.CarStation,
            assetId: featureToSelect.properties.id,
            feature: featureToSelect,
          });
        } else if (isParkAndRide(featureToSelect)) {
          mapSelectionDispatch({
            type: MapStateActionType.ParkAndRideStation,
            feature: featureToSelect,
          });
        } else if (isStopPlace(featureToSelect)) {
          mapSelectionDispatch({
            type: MapStateActionType.StopPlace,
            feature: featureToSelect,
          });
        } else if (isBikeStationV2(featureToSelect)) {
          mapSelectionDispatch({
            type: MapStateActionType.BikeStation,
            assetId: featureToSelect.properties.id,
            feature: featureToSelect,
          });
        } else if (isStationV2(featureToSelect)) {
          mapSelectionDispatch({
            type: MapStateActionType.Station,
            assetId: featureToSelect.properties.id,
            feature: featureToSelect,
          });
        }
        setCameraFocusMode(
          await getFocusMode(
            featureToSelect,
            currentLocation?.coordinates,
            true,
            true,
          ),
        );
      }
    },
    [
      activeShmoBooking?.state,
      currentLocation?.coordinates,
      mapSelectionDispatch,
      tabBarHeight,
    ],
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
          onCameraChanged={(state) => {
            if (followUserLocation && activeShmoBooking?.bookingId) {
              mapStateRef.current = state;
            }
          }}
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
            zoomLevel={
              mapStateRef.current?.properties.zoom ?? DEFAULT_ZOOM_LEVEL
            }
            centerCoordinate={
              mapStateRef.current?.properties.center
                ? mapStateRef.current.properties.center
                : [startingCoordinates.longitude, startingCoordinates.latitude]
            }
            padding={
              activeShmoBooking?.bookingId
                ? getMapPadding(tabBarHeight)
                : undefined
            }
            {...MapCameraConfig}
            followUserLocation={
              !!activeShmoBooking &&
              activeShmoBooking.state === ShmoBookingState.IN_USE &&
              followUserLocation
            }
            followUserMode={UserTrackingMode.FollowWithHeading}
            followPadding={getMapPadding(tabBarHeight)}
          />
          {showGeofencingZones && !vehicleError && !vehicleIsLoading && (
            <GeofencingZones
              systemId={
                vehicle?.system.id ?? activeShmoBooking?.asset.systemId ?? null
              }
              vehicleTypeId={
                vehicle?.vehicleType.id ??
                activeShmoBooking?.asset.vehicleTypeId ??
                null
              }
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
              showVehicles={showVehicles}
              showStations={showStations}
            />
          )}
        </MapView>
        <View
          style={[
            controlStyles.mapButtonsContainer,
            controlStyles.mapButtonsContainerRight,
            mapFilterIsOpen && {bottom: 0},
          ]}
        >
          <ExternalRealtimeMapButton
            onMapClick={(res) => {
              if (res.source === 'external-map-button') {
                mapSelectionDispatch({
                  type: MapStateActionType.ExternalMap,
                  url: res.url,
                });
              }
            }}
          />

          {showMapFilterButton && (
            <MapFilter
              onPress={() =>
                mapSelectionDispatch({
                  type: MapStateActionType.Filter,
                })
              }
              isLoading={false}
            />
          )}

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
      <MapBottomSheets
        unSelectMapItem={mapSelectionCloseCallback}
        mapCameraRef={mapCameraRef}
        mapViewRef={mapViewRef}
        tabBarHeight={tabBarHeight}
        mapProps={props}
      />
    </View>
  );
};
