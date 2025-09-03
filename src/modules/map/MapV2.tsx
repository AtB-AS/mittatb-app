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
import {useAutoSelectMapItem} from './hooks/use-auto-select-map-item';
import {
  GeofencingZoneCustomProps,
  MapProps,
  MapSelectionActionType,
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
  MapFilter,
  useVehicleQuery,
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
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {MapBottomSheets} from './hooks/use-map-bottom-sheets';
import {useTriggerCameraMoveEffect} from './hooks/use-trigger-camera-move-effect';
import {useDecideCameraFocusMode} from './hooks/use-decide-camera-focus-mode';
import {useUpdateBottomSheetWhenSelectedEntityChanges} from './hooks/use-update-bottom-sheet-when-selected-entity-changes';

const DEFAULT_ZOOM_LEVEL = 14.5;

export const MapV2 = (props: MapProps) => {
  const {initialLocation, includeSnackbar} = props;
  const {getCurrentCoordinates} = useGeolocationContext();
  const mapCameraRef = useRef<Camera>(null);
  const mapViewRef = useRef<MapView>(null);
  const {location: currentLocation} = useGeolocationContext();

  const {
    autoSelectedFeature,
    mapFilter,
    mapFilterIsOpen,
    setBottomSheetCurrentlyAutoSelected,
    setAutoSelectedMapItem,
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

  const [mapSelectionAction, setMapSelectionAction] = useState<
    MapSelectionActionType | undefined
  >({source: 'my-position', coords: startingCoordinates});

  const cameraFocusMode = useDecideCameraFocusMode(
    currentLocation?.coordinates,
    mapSelectionAction,
    mapViewRef,
    true,
    true,
  );

  const mapSelectionCloseCallback = useCallback(() => {
    setMapSelectionAction(undefined);
    setAutoSelectedMapItem(undefined);
    setBottomSheetCurrentlyAutoSelected(undefined);
    setBottomSheetToAutoSelect(undefined);
    closeBottomSheet();
    mapSelectionDispatch({mapState: 'NONE'});
  }, [
    closeBottomSheet,
    mapSelectionDispatch,
    setAutoSelectedMapItem,
    setBottomSheetCurrentlyAutoSelected,
    setBottomSheetToAutoSelect,
  ]);

  const distance =
    cameraFocusMode?.mode === 'map-lines'
      ? cameraFocusMode.distance
      : undefined;

  const {
    //selectedFeature: mapSelectionSelectedFeature,
    onReportParkingViolation,
  } = useUpdateBottomSheetWhenSelectedEntityChanges(
    props,
    distance,
    mapSelectionAction,
    mapViewRef,
    mapSelectionCloseCallback,
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

  const selectedFeature = mapSelectionState.feature || autoSelectedFeature;

  const selectedFeatureIsAVehicle =
    isScooterV2(selectedFeature) || isBicycleV2(selectedFeature);

  const {
    isGeofencingZonesEnabled,
    isShmoDeepIntegrationEnabled,
    isMapV2Enabled,
  } = useFeatureTogglesContext();

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

  useAutoSelectMapItem(
    mapCameraRef,
    mapViewRef,
    onReportParkingViolation,
    tabBarHeight,
  );

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
        setMapSelectionAction({source: 'map-click', feature});
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
          setMapSelectionAction({
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
        // use isVehicleFeature here?
        setMapSelectionAction({
          source: 'map-item',
          feature: featureToSelect,
        });
      }
    },
    [activeShmoBooking?.state, tabBarHeight],
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
          <ExternalRealtimeMapButton onMapClick={setMapSelectionAction} />

          {showMapFilterButton && (
            <MapFilter
              onPress={() => setMapSelectionAction({source: 'filters-button'})}
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
      />
    </View>
  );
};
