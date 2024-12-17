import {
  getCurrentCoordinatesGlobal,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {StyleSheet} from '@atb/theme';
import {MapRoute} from '@atb/travel-details-map-screen/components/MapRoute';
import MapboxGL, {LocationPuck} from '@rnmapbox/maps';
import {Feature, Polygon, Position} from 'geojson';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {polygon} from '@turf/helpers';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import {View} from 'react-native';
import {MapCameraConfig, MapViewConfig} from './MapConfig';
import {SelectionPin} from './components/SelectionPin';
import {LocationBar} from './components/LocationBar';
import {PositionArrow} from './components/PositionArrow';
import {MapFilter} from './components/filter/MapFilter';

import {useControlPositionsStyle} from './hooks/use-control-styles';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import {useAutoSelectMapItem} from './hooks/use-auto-select-map-item';
import {GeofencingZoneCustomProps, MapProps} from './types';

import {
  flyToLocation,
  isClusterFeature,
  SLIGHTLY_RAISED_MAP_PADDING,
} from '@atb/components/map';

import {
  isFeaturePoint,
  getFeaturesAtClick,
  isFeatureGeofencingZone,
  isStopPlace,
  isParkAndRide,
  mapPositionToCoordinates,
} from './utils';

import {
  GeofencingZones,
  useGeofencingZoneTextContent,
} from '@atb/components/map';
import {ExternalRealtimeMapButton} from './components/external-realtime-map/ExternalRealtimeMapButton';

import {isBicycle, isScooter} from '@atb/mobility';
import {isCarStation, isStation} from '@atb/mobility/utils';

import {Snackbar, useSnackbar} from '@atb/components/snackbar';
import {ShmoTesting} from './components/mobility/ShmoTesting';
import {ScanButton} from './components/ScanButton';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {AutoSelectableBottomSheetType, useMapState} from '@atb/MapContext';
import {useFeatureToggles} from '@atb/feature-toggles';

import {
  vehiclesAndStationsVectorSourceId,
  VehiclesAndStations,
} from './components/mobility/VehiclesAndStations';
import {SelectedFeatureIcon} from './components/mobility/SelectedFeatureIcon';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {useMapboxJsonStyle} from './hooks/use-mapbox-json-style';

export const Map = (props: MapProps) => {
  const isFocusedAndActive = useIsFocusedAndActive();
  const {initialLocation, includeSnackbar} = props;

  const shouldShowMapFilter = props.selectionMode === 'ExploreEntities';
  const shouldShowMapVehiclesAndStations =
    props.selectionMode === 'ExploreEntities'; // should probably split map components instead

  const {getCurrentCoordinates} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle(
    props.selectionMode === 'ExploreLocation',
  );

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : getCurrentCoordinatesGlobal() || FOCUS_ORIGIN,
    [initialLocation],
  );

  const {
    mapLines,
    selectedCoordinates,
    onMapClick,
    selectedFeature,
    onReportParkingViolation,
  } = useMapSelectionChangeEffect(
    props,
    mapViewRef,
    mapCameraRef,
    startingCoordinates,
  );

  const {bottomSheetCurrentlyAutoSelected} = useMapState();

  const aVehicleIsAutoSelected =
    bottomSheetCurrentlyAutoSelected?.type ===
      AutoSelectableBottomSheetType.Scooter ||
    bottomSheetCurrentlyAutoSelected?.type ===
      AutoSelectableBottomSheetType.Bicycle;

  const selectedFeatureIsAVehicle =
    isScooter(selectedFeature) || isBicycle(selectedFeature);

  const {isGeofencingZonesEnabled, isShmoDeepIntegrationEnabled} =
    useFeatureToggles();

  const showGeofencingZones =
    isGeofencingZonesEnabled &&
    (selectedFeatureIsAVehicle || aVehicleIsAutoSelected);

  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
  const {snackbarProps, showSnackbar, hideSnackbar} = useSnackbar();

  const {data: activeShmoBooking, isLoading: activeShmoBookingIsLoading} =
    useActiveShmoBookingQuery();

  const showScanButton =
    isShmoDeepIntegrationEnabled &&
    props.selectionMode === 'ExploreEntities' &&
    !activeShmoBooking &&
    !activeShmoBookingIsLoading &&
    (!selectedFeature || selectedFeatureIsAVehicle || aVehicleIsAutoSelected);

  useAutoSelectMapItem(mapCameraRef, onReportParkingViolation);

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
      if (!isFeaturePoint(feature)) return;

      const {coordinates: positionClicked} = feature.geometry;

      const featuresAtClick = await getFeaturesAtClick(feature, mapViewRef);
      if (!featuresAtClick || featuresAtClick.length === 0) return;
      const featureToSelect = featuresAtClick.reduce(
        (selected, currentFeature) =>
          getFeatureWeight(currentFeature, positionClicked) >
          getFeatureWeight(selected, positionClicked)
            ? currentFeature
            : selected,
      );

      // onFeatureClick is TODO!
      // car stations on click not working atm

      if (!showGeofencingZones && !isClusterFeature(featureToSelect)) {
        onMapClick({source: 'map-click', feature});
        return;
      }

      /**
       * this hides the Snackbar when a feature is clicked,
       * unless the feature is a geofencingZone, in which case
       * geofencingZoneOnPress will be called which sets it visible again
       */
      hideSnackbar();

      if (isFeatureGeofencingZone(featureToSelect)) {
        geofencingZoneOnPress(
          featureToSelect?.properties?.geofencingZoneCustomProps,
        );
      } else {
        if (isFeaturePoint(featureToSelect)) {
          if (isClusterFeature(featureToSelect)) {
            const fromZoomLevel = (await mapViewRef.current?.getZoom()) ?? 0;
            const toZoomLevel = Math.max(fromZoomLevel + 2);

            flyToLocation({
              coordinates: mapPositionToCoordinates(
                feature.geometry.coordinates,
              ),
              padding: SLIGHTLY_RAISED_MAP_PADDING,
              mapCameraRef,
              zoomLevel: toZoomLevel,
              animationDuration: Math.abs(fromZoomLevel - toZoomLevel) * 100,
            });
          } else {
            onMapClick({
              source: 'map-click',
              feature: featureToSelect,
            });
          }
        } else if (isScooter(selectedFeature)) {
          // outside of operational area, rules unspecified
          geofencingZoneOnPress(undefined);
        }
      }
    },
    [
      geofencingZoneOnPress,
      hideSnackbar,
      onMapClick,
      showGeofencingZones,
      selectedFeature,
    ],
  );

  useLayoutEffect(() => {
    // Prevent tile requests while the map isn't visible.
    //console.log('setSourceVisibility', !!isFocusedAndActive);
    // For some reason setSourceVisibility only works when changing to a tab that hasn't already been rendered.
    // https://github.com/rnmapbox/maps/pull/3616
    // should be fixed in rnmapbox version v10.1.32
    mapViewRef.current?.setSourceVisibility(
      !!isFocusedAndActive,
      vehiclesAndStationsVectorSourceId,
    );
  }, [isFocusedAndActive]);

  const {mapboxJsonStyle, mapboxStyleIsLoading} = useMapboxJsonStyle();
  if (mapboxStyleIsLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      {props.selectionMode === 'ExploreLocation' && (
        <LocationBar
          coordinates={selectedCoordinates || startingCoordinates}
          onSelect={props.onLocationSelect}
        />
      )}
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          pitchEnabled={false}
          onPress={onFeatureClick}
          testID="mapView"
          {...{
            ...MapViewConfig,
            styleURL: undefined,
            styleJSON: mapboxJsonStyle,
          }}
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

          {shouldShowMapVehiclesAndStations && (
            <VehiclesAndStations selectedFeature={selectedFeature} />
          )}
          <SelectedFeatureIcon selectedFeature={selectedFeature} />

          {showGeofencingZones && (
            <GeofencingZones
              selectedVehicleId={
                aVehicleIsAutoSelected
                  ? bottomSheetCurrentlyAutoSelected.id
                  : selectedFeature?.properties?.id
              }
            />
          )}
          {mapLines && <MapRoute lines={mapLines} />}
          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
          {props.selectionMode === 'ExploreLocation' && selectedCoordinates && (
            <SelectionPin coordinates={selectedCoordinates} id="selectionPin" />
          )}
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          <ExternalRealtimeMapButton onMapClick={onMapClick} />

          {shouldShowMapFilter && (
            <MapFilter onPress={() => onMapClick({source: 'filters-button'})} />
          )}
          <PositionArrow
            onPress={async () => {
              const coordinates = await getCurrentCoordinates(true);
              if (coordinates) {
                onMapClick({
                  source: 'my-position',
                  coords: coordinates,
                });
              }
            }}
          />
        </View>
        {isShmoDeepIntegrationEnabled && (
          <ShmoTesting selectedVehicleId={selectedFeature?.properties?.id} />
        )}
        {showScanButton && <ScanButton />}
        {includeSnackbar && <Snackbar {...snackbarProps} />}
      </View>
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));

function getFeatureWeight(feature: Feature, positionClicked: Position): number {
  if (isFeaturePoint(feature)) {
    return isStopPlace(feature) ||
      isScooter(feature) ||
      isBicycle(feature) ||
      isStation(feature) ||
      isCarStation(feature) ||
      isParkAndRide(feature)
      ? 3
      : 1;
  } else if (isFeatureGeofencingZone(feature)) {
    const coordinates = (feature.geometry as Polygon).coordinates;
    const polygonGeometry = polygon(coordinates);
    const positionClickedIsInsidePolygon = turfBooleanPointInPolygon(
      positionClicked,
      polygonGeometry,
    );
    return positionClickedIsInsidePolygon ? 2 : 0;
  } else {
    return 0;
  }
}
