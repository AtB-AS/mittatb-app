import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature} from 'geojson';
import React, {useMemo, useRef} from 'react';
import {View} from 'react-native';
import {LocationBar} from './components/LocationBar';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import MapRoute from '@atb/travel-details-map-screen/components/MapRoute';
import {isFeaturePoint, zoomIn, zoomOut} from './utils';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import SelectionPinConfirm from '@atb/assets/svg/color/map/SelectionPinConfirm';
import SelectionPinShadow from '@atb/assets/svg/color/map/SelectionPinShadow';
import {MapProps} from './types';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {MapCameraConfig, MapViewConfig} from './MapConfig';
import {PositionArrow} from './components/PositionArrow';
import {MapControls} from './components/MapControls';
import {shadows} from './components/shadows';
import {useVehicles} from './hooks/use-vehicles';
import {useRegion} from '@atb/components/map/hooks/use-region';

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

  const {currentCoordinates, currentZoom, onRegionChange} =
    useRegion(startingCoordinates);

  const {vehiclesFeatureCollection} = useVehicles(
    currentCoordinates,
    currentZoom,
  );

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
          onRegionWillChange={onRegionChange}
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
          <MapboxGL.ShapeSource
            id={'vehicles'}
            shape={vehiclesFeatureCollection}
            cluster
          >
            <MapboxGL.SymbolLayer
              id="icon"
              filter={['!', ['has', 'point_count']]}
              style={{
                textField: '20%',
                textAnchor: 'top-left',
                textOffset: [0.4, 0.7],
                textColor: '#920695',
                textSize: 12,
                iconImage: 'PinScooter',
                iconSize: 0.75,
              }}
            />
            <MapboxGL.SymbolLayer
              id="clusterIcon"
              filter={['has', 'point_count']}
              style={{
                iconImage: 'Scooter',
                iconSize: 0.75,
              }}
            />
            <MapboxGL.CircleLayer
              id="cluster"
              filter={['has', 'point_count']}
              belowLayerID="clusterIcon"
              style={{
                circleColor: '#920695',
                circleStrokeColor: '#920695',
                circleOpacity: 0.7,
                circleStrokeOpacity: 0.2,
                circleStrokeWidth: [
                  'min',
                  ['+', 2, ['get', 'point_count']],
                  12,
                ],
                circleRadius: 12,
              }}
            />
          </MapboxGL.ShapeSource>
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
