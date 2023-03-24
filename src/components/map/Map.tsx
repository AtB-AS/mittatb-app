import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import MapboxGL, {RegionPayload} from '@rnmapbox/maps';
import {Feature, GeoJSON} from 'geojson';
import React, {useMemo, useRef} from 'react';
import {View} from 'react-native';
import {LocationBar} from './components/LocationBar';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import MapRoute from '@atb/travel-details-map-screen/components/MapRoute';
import {isFeaturePoint, zoomIn, zoomOut} from './utils';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import SelectionPinConfirm from '@atb/assets/svg/color/map/SelectionPinConfirm';
import SelectionPinShadow from '@atb/assets/svg/color/map/SelectionPinShadow';
import {MapProps, MapFilter as MapFilterType} from './types';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {MapCameraConfig, MapViewConfig} from './MapConfig';
import {PositionArrow} from './components/PositionArrow';
import {MapControls} from './components/MapControls';
import {shadows} from './components/shadows';
import * as Mobility from '@atb/components/map/components/mobility';
import {MapFilter} from '@atb/components/map/components/MapFilter';

export const Map = (props: MapProps) => {
  const {initialLocation} = props;
  const {location: currentLocation} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();

  const startingCoordinates = useMemo(
    () =>
      initialLocation && initialLocation?.resultType !== 'geolocation'
        ? initialLocation.coordinates
        : currentLocation?.coordinates || FOCUS_ORIGIN,
    [],
  );

  const {mapLines, selectedCoordinates, onMapClick} =
    useMapSelectionChangeEffect(
      props,
      mapViewRef,
      mapCameraRef,
      startingCoordinates,
    );

  const onRegionChange = (
    region: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ) => {
    if (props.vehicles) {
      props.vehicles.fetchVehicles(region);
    }
    if (props.stations) {
      props.stations.fetchStations(region);
    }
  };

  const onFilterChange = (filter: MapFilterType) => {
    if (filter.vehicles) {
      props.vehicles?.onFilterChange(filter.vehicles);
    }
    if (filter.stations) {
      props.stations?.onFilterChange(filter.stations);
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
          onRegionDidChange={onRegionChange}
          onPress={async (feature: Feature) => {
            if (isFeaturePoint(feature)) {
              onMapClick({
                source: 'map-click',
                feature,
              });
            }
          }}
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
          {mapLines && <MapRoute lines={mapLines} />}
          <MapboxGL.UserLocation showsUserHeadingIndicator />
          {props.selectionMode === 'ExploreLocation' && selectedCoordinates && (
            <MapboxGL.PointAnnotation
              id={'selectionPin'}
              coordinate={[
                selectedCoordinates.longitude,
                selectedCoordinates.latitude,
              ]}
            >
              <View style={styles.pin}>
                <SelectionPinConfirm width={40} height={40} />
                <SelectionPinShadow width={40} height={4} />
              </View>
            </MapboxGL.PointAnnotation>
          )}
          {props.vehicles && (
            <Mobility.Vehicles
              mapCameraRef={mapCameraRef}
              vehicles={props.vehicles.vehicles}
              onPress={props.vehicles.onPress}
            />
          )}
          {props.stations && (
            <Mobility.Stations
              mapCameraRef={mapCameraRef}
              stations={props.stations.stations}
              onPress={props.stations.onPress}
            />
          )}
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          {(props.vehicles || props.stations) && (
            <MapFilter
              isLoading={{
                vehicles: props.vehicles?.isLoading ?? false,
                stations: props.stations?.isLoading ?? false,
              }}
              onFilterChange={onFilterChange}
            />
          )}
          {currentLocation && (
            <PositionArrow
              onPress={() => {
                onMapClick({
                  source: 'my-position',
                  coords: currentLocation.coordinates,
                });
              }}
            />
          )}
          <MapControls
            zoomIn={() => zoomIn(mapViewRef, mapCameraRef)}
            zoomOut={() => zoomOut(mapViewRef, mapCameraRef)}
          />
        </View>
      </View>
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
  pin: {...shadows},
}));
