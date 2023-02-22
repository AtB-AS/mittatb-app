import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {Feature, GeoJSON} from 'geojson';
import React, {useMemo, useRef} from 'react';
import {View} from 'react-native';
import {LocationBar} from './components/LocationBar';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import MapRoute from '@atb/travel-details-map-screen/components/MapRoute';
import {getVisibleRange, isFeaturePoint, zoomIn, zoomOut} from './utils';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import SelectionPinConfirm from '@atb/assets/svg/color/map/SelectionPinConfirm';
import SelectionPinShadow from '@atb/assets/svg/color/map/SelectionPinShadow';
import {MapProps} from './types';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {MapCameraConfig, MapViewConfig} from './MapConfig';
import {PositionArrow} from './components/PositionArrow';
import {MapControls} from './components/MapControls';
import {shadows} from './components/shadows';
import {Vehicles} from '@atb/components/map/components/Vehicles';

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
    feature: GeoJSON.Feature<GeoJSON.Point, RegionPayload>,
  ) => {
    if (!props.vehicles) return;
    const [longitude, latitude] = feature.geometry.coordinates;
    const zoom = feature.properties.zoomLevel;
    const range = getVisibleRange(feature.properties.visibleBounds);
    props.vehicles.fetchVehicles({
      coordinates: {longitude, latitude},
      zoom,
      radius: range / 2,
    });
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
          {props.vehicles && <Vehicles vehicles={props.vehicles.vehicles} />}
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
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
