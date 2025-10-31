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
} from '@rnmapbox/maps';
import {Feature} from 'geojson';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {MapCameraConfig, getSlightlyRaisedMapPadding} from './MapConfig';
import {GeofencingZoneCustomProps, MapPropertiesType, MapProps} from './types';
import {
  isFeaturePoint,
  getFeaturesAtClick,
  isFeatureGeofencingZone,
  isClusterFeatureV2,
  isQuayFeature,
  mapPositionToCoordinates,
  flyToLocation,
  getFeatureToSelect,
  isParkAndRide,
  isStopPlace,
} from './utils';
import {
  GeofencingZones,
  MapBottomSheetType,
  MapStateActionType,
  useGeofencingZoneTextContent,
  useMapViewConfig,
} from '@atb/modules/map';
import {
  isBicycleV2,
  isScooterV2,
  useVehicleQuery,
  isStationV2,
  isCarStationV2,
  isBikeStationV2,
} from '@atb/modules/mobility';

import {Snackbar, useSnackbar, useStableValue} from '@atb/components/snackbar';
import {useActiveShmoBookingQuery} from '@atb/modules/mobility';
import {useMapContext} from '@atb/modules/map';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {NationalStopRegistryFeatures} from './components/national-stop-registry-features';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {VehiclesAndStations} from './components/mobility/VehiclesAndStations';
import {useIsFocused} from '@react-navigation/native';
import {SelectedFeatureIcon} from './components/SelectedFeatureIcon';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {useStablePreviousValue} from '@atb/utils/use-stable-previous-value';
import {MapBottomSheets} from './MapBottomSheets';

import {MapButtons} from './components/MapButtons';
import {useFlyToSelectedMapItemWithPadding} from './hooks/use-fly-to-selected-map-item-with-padding';

const DEFAULT_ZOOM_LEVEL = 14.5;

export const MapV2 = (props: MapProps) => {
  const {includeSnackbar} = props;
  const {getCurrentCoordinates} = useGeolocationContext();
  const mapCameraRef = useRef<Camera>(null);
  const mapViewRef = useRef<MapView>(null);
  const [initMapLoaded, setInitMapLoaded] = useState(false);

  const {mapFilter, mapState, dispatchMapState, paddingBottomMap} =
    useMapContext();

  const [stalePaddingBottomMap, setStalePaddingBottomMap] =
    useState(paddingBottomMap);

  useFlyToSelectedMapItemWithPadding(mapCameraRef, mapViewRef);

  const isFocused = useIsFocused();

  const startingCoordinates = FOCUS_ORIGIN || FOCUS_ORIGIN;

  const showVehicles = mapFilter?.mobility.SCOOTER?.showAll ?? false;
  const showStations =
    (mapFilter?.mobility.BICYCLE?.showAll ||
      mapFilter?.mobility.CAR?.showAll) ??
    false;
  const shouldShowVehiclesAndStations =
    isFocused && (showVehicles || showStations); // don't send tile requests while in the background, and always get fresh data upon enter
  const mapViewConfig = useMapViewConfig({shouldShowVehiclesAndStations});

  const selectedFeature = mapState.feature;

  const selectedFeatureIsAVehicle =
    isScooterV2(selectedFeature) || isBicycleV2(selectedFeature);

  const {isGeofencingZonesEnabled} = useFeatureTogglesContext();

  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
  const {snackbarProps, showSnackbar, hideSnackbar} = useSnackbar();

  const {data: activeShmoBooking} = useActiveShmoBookingQuery();

  const showGeofencingZones =
    isGeofencingZonesEnabled &&
    (selectedFeatureIsAVehicle ||
      (activeShmoBooking?.bookingId !== undefined &&
        activeShmoBooking.state === ShmoBookingState.IN_USE));

  const {
    data: vehicle,
    isLoading: vehicleIsLoading,
    isError: vehicleError,
  } = useVehicleQuery(selectedFeature?.properties?.id);

  const [followUserLocation, setFollowUserLocation] = useState(false);
  const mapPropertiesRef = useRef<MapPropertiesType | null>({
    center: [startingCoordinates.longitude, startingCoordinates.latitude],
    zoom: mapState.customZoomLevel ?? DEFAULT_ZOOM_LEVEL,
  });

  useEffect(() => {
    if (followUserLocation) {
      setStalePaddingBottomMap(paddingBottomMap);
    }
  }, [followUserLocation, paddingBottomMap]);

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
      showSnackbar({content: textContent, position: 'top'});
    },
    [showSnackbar, getGeofencingZoneTextContent],
  );

  const locationArrowOnPress = useCallback(async () => {
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
            : getSlightlyRaisedMapPadding(paddingBottomMap),
          mapCameraRef,
          mapViewRef,
          zoomLevel: DEFAULT_ZOOM_LEVEL + 2.5,
        });
      }
    }
  }, [
    getCurrentCoordinates,
    activeShmoBooking,
    selectedFeature,
    paddingBottomMap,
  ]);

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
      if (!showGeofencingZones && !isActiveTrip) return;

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
      } else if (isScooterV2(selectedFeature) && !isActiveTrip) {
        // outside of operational area, rules unspecified
        geofencingZoneOnPress(undefined);
      }
    },
    [
      activeShmoBooking?.state,
      showGeofencingZones,
      hideSnackbar,
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
          padding: getSlightlyRaisedMapPadding(paddingBottomMap),
          mapCameraRef,
          mapViewRef,
          zoomLevel: toZoomLevel,
        });
      } else if (isFeaturePoint(featureToSelect)) {
        if (isQuayFeature(featureToSelect)) return;

        if (isScooterV2(featureToSelect)) {
          dispatchMapState({
            type: MapStateActionType.Scooter,
            feature: featureToSelect,
          });
        } else if (isBicycleV2(featureToSelect)) {
          dispatchMapState({
            type: MapStateActionType.Bicycle,
            feature: featureToSelect,
          });
        } else if (isCarStationV2(featureToSelect)) {
          dispatchMapState({
            type: MapStateActionType.CarStation,
            feature: featureToSelect,
          });
        } else if (isParkAndRide(featureToSelect)) {
          dispatchMapState({
            type: MapStateActionType.ParkAndRideStation,
            feature: featureToSelect,
          });
        } else if (isStopPlace(featureToSelect)) {
          dispatchMapState({
            type: MapStateActionType.StopPlace,
            feature: featureToSelect,
          });
        } else if (isBikeStationV2(featureToSelect)) {
          dispatchMapState({
            type: MapStateActionType.BikeStation,
            feature: featureToSelect,
          });
        } else if (isStationV2(featureToSelect)) {
          dispatchMapState({
            type: MapStateActionType.Station,
            feature: featureToSelect,
          });
        }
      }
    },
    [activeShmoBooking?.state, paddingBottomMap, dispatchMapState],
  );

  const handleBreakFollow = useCallback(() => {
    setStalePaddingBottomMap(paddingBottomMap);
    setFollowUserLocation(false);
  }, [paddingBottomMap]);

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
              mapPropertiesRef.current = {...state.properties};
            }
          }}
          {...mapViewConfig}
          onDidFinishLoadingMap={() => {
            setInitMapLoaded(true);
          }}
        >
          <Viewport
            onStatusChanged={(status) => {
              if (status.to.kind === 'idle') {
                handleBreakFollow();
              }
            }}
          />
          <Camera
            ref={mapCameraRef}
            zoomLevel={
              !initMapLoaded
                ? (mapPropertiesRef.current?.zoom ?? DEFAULT_ZOOM_LEVEL)
                : undefined
            }
            centerCoordinate={
              !initMapLoaded ? mapPropertiesRef.current?.center : undefined
            }
            padding={
              activeShmoBooking?.bookingId
                ? getSlightlyRaisedMapPadding(
                    followUserLocation
                      ? paddingBottomMap
                      : stalePaddingBottomMap,
                  )
                : undefined
            }
            {...MapCameraConfig}
            followUserLocation={
              !!activeShmoBooking &&
              activeShmoBooking.state === ShmoBookingState.IN_USE &&
              followUserLocation
            }
            followUserMode={UserTrackingMode.FollowWithHeading}
            followPadding={getSlightlyRaisedMapPadding(paddingBottomMap)}
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
        {mapState.bottomSheetType === MapBottomSheetType.None && (
          <MapButtons locationArrowOnPress={locationArrowOnPress} />
        )}
        {includeSnackbar && <Snackbar {...snackbarProps} />}
      </View>
      <MapBottomSheets
        mapViewRef={mapViewRef}
        mapProps={props}
        locationArrowOnPress={locationArrowOnPress}
      />
    </View>
  );
};
