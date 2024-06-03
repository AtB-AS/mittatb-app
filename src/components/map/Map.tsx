import {useGeolocationState} from '@atb/GeolocationContext';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import {StyleSheet} from '@atb/theme';
import {MapRoute} from '@atb/travel-details-map-screen/components/MapRoute';
import MapboxGL, {LocationPuck, MapState} from '@rnmapbox/maps';
import {Feature, Position} from 'geojson';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {MapCameraConfig, MapViewConfig} from './MapConfig';
import {SelectionPin} from './components/SelectionPin';
import {LocationBar} from './components/LocationBar';
import {PositionArrow} from './components/PositionArrow';
import {MapFilter} from './components/filter/MapFilter';
import {Stations, Vehicles} from './components/mobility';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import {
  GeofencingZoneKeys,
  GeofencingZoneCustomProps,
  MapProps,
  MapRegion,
} from './types';
import {
  isFeaturePoint,
  getFeaturesAtClick,
  isFeatureGeofencingZone,
  isStopPlace,
  isParkAndRide,
} from './utils';
import isEqual from 'lodash.isequal';
import {
  GeofencingZones,
  useGeofencingZoneTextContent,
} from '@atb/components/map';

import {useGeofencingZonesEnabled} from '@atb/mobility/use-geofencing-zones-enabled';
import {isBicycle, isScooter} from '@atb/mobility';
import {isCarStation, isStation} from '@atb/mobility/utils';

import {Snackbar, useSnackbar} from '../snackbar';

export const Map = (props: MapProps) => {
  const {initialLocation} = props;
  const {currentCoordinatesRef, getCurrentCoordinates} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : currentCoordinatesRef?.current || FOCUS_ORIGIN,
    [currentCoordinatesRef, initialLocation],
  );

  const {mapLines, selectedCoordinates, onMapClick, selectedFeature} =
    useMapSelectionChangeEffect(
      props,
      mapViewRef,
      mapCameraRef,
      startingCoordinates,
    );

  const {getGeofencingZoneTextContent} = useGeofencingZoneTextContent();
  const {snackbarProps, showSnackbar, hideSnackbar} = useSnackbar();

  useEffect(() => {
    // hide the snackbar when the bottom sheet is closed
    !selectedFeature && hideSnackbar();
  }, [selectedFeature, hideSnackbar]);

  const geofencingZoneOnPress = useCallback(
    (
      geofencingZoneCustomProps?: GeofencingZoneCustomProps<GeofencingZoneKeys>,
    ) => {
      const textContent = getGeofencingZoneTextContent(
        geofencingZoneCustomProps,
      );
      showSnackbar({textContent, position: 'top'});
    },
    [showSnackbar, getGeofencingZoneTextContent],
  );

  const [geofencingZonesEnabled, geofencingZonesEnabledDebugOverrideReady] =
    useGeofencingZonesEnabled();

  const updateRegionForVehicles = props.vehicles?.updateRegion;
  const updateRegionForStations = props.stations?.updateRegion;
  const [mapRegion, setMapRegion] = useState<MapRegion>();
  useEffect(() => {
    if (!mapRegion) return;
    updateRegionForVehicles?.(mapRegion);
    updateRegionForStations?.(mapRegion);
  }, [mapRegion, updateRegionForVehicles, updateRegionForStations]);

  const onDidFinishLoadingMap = async () => {
    const visibleBounds = await mapViewRef.current?.getVisibleBounds();
    const zoomLevel = await mapViewRef.current?.getZoom();
    const center = await mapViewRef.current?.getCenter();

    if (!visibleBounds || !zoomLevel || !center) return;

    setMapRegion({
      visibleBounds,
      zoomLevel,
      center,
    });
  };

  /**
   * OnMapIdle fires more often than expected, because of that we check if the
   * map region is changed before updating its state.
   *
   * There is a slight performance overhead by deep comparing previous and new
   * map regions on each on map idle, but since we have control over the size of
   * the objects it should be ok. The risk of firing effects that uses the map
   * region too often is greater than the risk introduced by the performance
   * overhead.
   */
  const onMapIdle = (state: MapState) => {
    const newMapRegion: MapRegion = {
      visibleBounds: [state.properties.bounds.ne, state.properties.bounds.sw],
      zoomLevel: state.properties.zoom,
      center: state.properties.center,
    };
    setMapRegion((prevMapRegion) =>
      isEqual(prevMapRegion, newMapRegion) ? prevMapRegion : newMapRegion,
    );
  };

  /**
   * As setting onPress on the GeofencingZones ShapeSource prevents MapView's onPress
   * from being triggered, the onPress logic is handled here instead.
   * This makes it possible to click directly on e.g. bus stops while GeofencingZones are visible.
   * Step 1: query all rendered features
   * Step 2: decide feature to select
   * Step 3: selected the feature
   */

  const onFeatureClick = async (feature: Feature) => {
    if (!isFeaturePoint(feature)) return;
    const {coordinates: positionClicked} = feature.geometry;

    const featuresAtClick = await getFeaturesAtClick(feature, mapViewRef);
    if (!featuresAtClick || featuresAtClick.length === 0) return;
    //console.log('featuresAtClick', JSON.stringify(featuresAtClick));
    const featureToSelect = featuresAtClick.reduce((selected, currentFeature) =>
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

    if (isFeatureGeofencingZone(featureToSelect)) {
      geofencingZoneOnPress(
        featureToSelect?.properties?.geofencingZoneCustomProps,
      );
    } else {
      if (isFeaturePoint(featureToSelect)) {
        onMapClick({
          source: 'map-click',
          feature: featureToSelect,
        });
      } else if (isScooter(selectedFeature)) {
        // outside of operational area, rules unspecified
        geofencingZoneOnPress(undefined);
      }
    }
  };

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
          onDidFinishLoadingMap={onDidFinishLoadingMap}
          onMapIdle={onMapIdle}
          onPress={onFeatureClick}
          {...MapViewConfig}
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

          {geofencingZonesEnabled &&
            geofencingZonesEnabledDebugOverrideReady &&
            selectedFeature && (
              <GeofencingZones selectedFeature={selectedFeature} />
            )}

          {mapLines && <MapRoute lines={mapLines} />}
          <LocationPuck puckBearing="heading" puckBearingEnabled={true} />
          {props.selectionMode === 'ExploreLocation' && selectedCoordinates && (
            <SelectionPin coordinates={selectedCoordinates} id="selectionPin" />
          )}
          {props.vehicles && (
            <Vehicles
              vehicles={props.vehicles.vehicles}
              mapCameraRef={mapCameraRef}
              mapViewRef={mapViewRef}
              onClusterClick={(feature) => {
                onMapClick({
                  source: 'cluster-click',
                  feature,
                });
              }}
            />
          )}
          {props.stations && (
            <Stations
              stations={props.stations.stations}
              mapCameraRef={mapCameraRef}
              onClusterClick={(feature) => {
                onMapClick({
                  source: 'cluster-click',
                  feature,
                });
              }}
            />
          )}
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          {(props.vehicles || props.stations) && (
            <MapFilter
              onPress={() => onMapClick({source: 'filters-button'})}
              isLoading={
                (props.vehicles?.isLoading || props.stations?.isLoading) ??
                false
              }
            />
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

        <Snackbar {...snackbarProps} />
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
    const positionClickedIsInsidePolygon = turfBooleanPointInPolygon(
      positionClicked,
      feature.geometry,
    );
    return positionClickedIsInsidePolygon ? 2 : 0;
  } else {
    return 0;
  }
}
