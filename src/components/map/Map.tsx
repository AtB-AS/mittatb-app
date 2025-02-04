import {
  getCurrentCoordinatesGlobal,
  useGeolocationContext,
} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {StyleSheet} from '@atb/theme';
import {MapRoute} from '@atb/travel-details-map-screen/components/MapRoute';
import MapboxGL, {LocationPuck} from '@rnmapbox/maps';
import {Feature, Position} from 'geojson';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {MapCameraConfig, MapViewConfig} from './MapConfig';
import {SelectionPin} from './components/SelectionPin';
import {LocationBar} from './components/LocationBar';
import {PositionArrow} from './components/PositionArrow';
import {BonusProgramMapButton} from './components/bonus-program/BonusProgramMapButton';
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
  isGeofencingZoneFeature,
  isStopPlaceFeature,
  isParkAndRideFeature,
  mapPositionToCoordinates,
  isQuayFeature,
} from './utils';

import {
  GeofencingZones,
  useGeofencingZoneTextContent,
} from '@atb/components/map';
import {ExternalRealtimeMapButton} from './components/external-realtime-map/ExternalRealtimeMapButton';

import {isStationFeature, isVehiclesClusteredFeature} from '@atb/mobility';

import {Snackbar, useSnackbar} from '@atb/components/snackbar';
import {ShmoTesting} from './components/mobility/ShmoTesting';
import {ScanButton} from './components/ScanButton';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {AutoSelectableBottomSheetType, useMapContext} from '@atb/MapContext';
import {useFeatureTogglesContext} from '@atb/feature-toggles';

import {VehiclesAndStations} from './components/mobility/VehiclesAndStations';
import {SelectedFeatureIcon} from './components/mobility/SelectedFeatureIcon';
import {useMapboxJsonStyle} from './hooks/use-mapbox-json-style';
import {useIsFocused} from '@react-navigation/native';
import {NationalStopRegistryFeatures} from './NationalStopRegistryFeatures';
import {VehiclePropertiesSchema} from '@atb/api/types/mobility';
import {isVehicleFeature} from '@atb/mobility/utils';

export const Map = (props: MapProps) => {
  const {initialLocation, includeSnackbar} = props;

  // todo: either remove filters entirely, or fix
  const shouldShowMapFilter = false; //props.selectionMode === 'ExploreEntities'; // hidden for now
  const shouldShowMapVehiclesAndStations =
    props.selectionMode === 'ExploreEntities'; // should probably split map components instead

  const {getCurrentCoordinates} = useGeolocationContext();
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

  const {bottomSheetCurrentlyAutoSelected} = useMapContext();

  const aVehicleIsAutoSelected =
    bottomSheetCurrentlyAutoSelected?.type ===
      AutoSelectableBottomSheetType.Scooter ||
    bottomSheetCurrentlyAutoSelected?.type ===
      AutoSelectableBottomSheetType.Bicycle;

  const selectedFeatureIsAVehicle = VehiclePropertiesSchema.safeParse(
    selectedFeature?.properties,
  ).success;

  const {
    isBonusProgramEnabled,
    isGeofencingZonesEnabled,
    isShmoDeepIntegrationEnabled,
  } = useFeatureTogglesContext();

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

  useAutoSelectMapItem(mapCameraRef, onReportParkingViolation, onMapClick);

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

      // should split components instead of this, ExploreLocation should only depend on location state, not features
      if (props.selectionMode == 'ExploreLocation') {
        onMapClick({
          source: 'map-click',
          feature,
        });
      }

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
      /**
       * this hides the Snackbar when a feature is clicked,
       * unless the feature is a geofencingZone, in which case
       * geofencingZoneOnPress will be called which sets it visible again
       */
      hideSnackbar();

      if (isQuayFeature(featureToSelect)) {
        // In this case we might want to either
        // - select a stop place with the clicked quay sorted on top
        // - have a bottom sheet with departures just for the clicked quay
        return; // currently - do nothing
      } else if (isGeofencingZoneFeature(featureToSelect)) {
        geofencingZoneOnPress(
          featureToSelect.properties.geofencingZoneCustomProps,
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
              animationDuration: 200,
            });
          } else {
            if (
              isStopPlaceFeature(featureToSelect) ||
              isVehicleFeature(featureToSelect) ||
              isStationFeature(featureToSelect) ||
              isParkAndRideFeature(featureToSelect)
            ) {
              onMapClick({
                source: 'map-click',
                feature: featureToSelect,
              });
            }
          }
        } else if (isVehiclesClusteredFeature(selectedFeature)) {
          // outside of operational area, rules unspecified
          geofencingZoneOnPress(undefined);
        }
      }
    },
    [
      geofencingZoneOnPress,
      hideSnackbar,
      onMapClick,
      selectedFeature,
      props.selectionMode,
    ],
  );

  const [initialZoomLevel, setInitialZoomLevel] = useState(15);
  const [initialCenterCoordinate, setInitialCenterCoordinate] = useState<
    Position | undefined
  >([startingCoordinates.longitude, startingCoordinates.latitude]);

  const isFocused = useIsFocused();
  const mapboxJsonStyle = useMapboxJsonStyle();
  if (!isFocused) {
    // Returning null when !isFocused prevents unnecessary tile requests while the map isn't shown.
    // Center and Zoom are captured to re-init the map where it left off.
    if (mapViewRef.current) {
      mapViewRef.current
        ?.getCenter()
        .then((center) => setInitialCenterCoordinate(center));
      mapViewRef.current
        ?.getZoom()
        .then((zoomLevel) => setInitialZoomLevel(zoomLevel));
    }
    return null;
  }

  return (
    <View style={styles.container}>
      {props.selectionMode === 'ExploreLocation' && ( // should split components instead
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
            zoomLevel={initialZoomLevel}
            centerCoordinate={initialCenterCoordinate}
            {...MapCameraConfig}
          />

          {shouldShowMapVehiclesAndStations && (
            <VehiclesAndStations selectedFeature={selectedFeature} />
          )}

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

          <NationalStopRegistryFeatures
            selectedFeature={
              selectedFeature
              // props.selectionMode === 'ExploreLocation' // should split components instead
              //   ? undefined // todo: SelectionPin must be a SymbolLayer to control aboveLayerId
              //   : selectedFeature // alternatively: move the map instead of the pin, draw the pin outside mapbox
            }
          />

          {props.selectionMode !== 'ExploreLocation' && ( // should split components instead
            <SelectedFeatureIcon selectedFeature={selectedFeature} />
          )}

          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
          {props.selectionMode === 'ExploreLocation' && selectedCoordinates && (
            <SelectionPin coordinates={selectedCoordinates} id="selectionPin" />
          )}
        </MapboxGL.MapView>
        {isBonusProgramEnabled && props.selectionMode === 'ExploreEntities' && (
          <View
            style={[
              controlStyles.mapButtonsContainer,
              controlStyles.mapButtonsContainerLeft,
            ]}
          >
            <BonusProgramMapButton
              onPress={() => onMapClick({source: 'bonus-program-button'})}
            />
          </View>
        )}

        <View
          style={[
            controlStyles.mapButtonsContainer,
            controlStyles.mapButtonsContainerRight,
          ]}
        >
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
        {isShmoDeepIntegrationEnabled &&
          props.selectionMode === 'ExploreEntities' && (
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
    return isStopPlaceFeature(feature) ||
      isVehiclesClusteredFeature(feature) ||
      isStationFeature(feature) ||
      isParkAndRideFeature(feature)
      ? 3
      : 1;
  } else if (isGeofencingZoneFeature(feature)) {
    const positionClickedIsInsideGeofencingZone = turfBooleanPointInPolygon(
      positionClicked,
      feature.geometry,
    );
    return positionClickedIsInsideGeofencingZone ? 2 : 0;
  } else {
    return 0;
  }
}
