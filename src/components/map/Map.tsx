import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import MapboxGL from '@rnmapbox/maps';
import {Feature} from 'geojson';
import React, {useMemo, useRef} from 'react';
import {View} from 'react-native';
import {LocationBar} from './components/LocationBar';
import {useMapSelectionChangeEffect} from './hooks/use-map-selection-change-effect';
import {MapRoute} from '@atb/travel-details-map-screen/components/MapRoute';
import {isFeaturePoint} from './utils';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import SelectionPinConfirm from '@atb/assets/svg/color/map/SelectionPinConfirm';
import SelectionPinShadow from '@atb/assets/svg/color/map/SelectionPinShadow';
import {MapFilterType, MapProps, MapRegion} from './types';
import {useControlPositionsStyle} from './hooks/use-control-styles';
import {MapCameraConfig, MapViewConfig} from './MapConfig';
import {PositionArrow} from './components/PositionArrow';
import {shadows} from './components/shadows';
import {MapFilter} from './components/filter/MapFilter';
import {Stations, Vehicles} from './components/mobility';
import {useAnalytics} from '@atb/analytics';
import {MapState} from '@rnmapbox/maps/lib/typescript/components/MapView';

export const Map = (props: MapProps) => {
  const {initialLocation} = props;
  const {location: currentLocation} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();
  const analytics = useAnalytics();

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

  const loadMobility = (mapRegion: MapRegion) => {
    if (props.vehicles) {
      props.vehicles.updateRegion(mapRegion);
    }
    if (props.stations) {
      props.stations.updateRegion(mapRegion);
    }
  };

  const onDidFinishLoadingMap = async () => {
    const visibleBounds = await mapViewRef.current?.getVisibleBounds();
    const zoomLevel = await mapViewRef.current?.getZoom();
    const center = await mapViewRef.current?.getCenter();

    if (!visibleBounds || !zoomLevel || !center) return;

    loadMobility({
      visibleBounds,
      zoomLevel,
      center,
    });
  };

  const onMapIdle = (state: MapState) => {
    loadMobility({
      visibleBounds: [state.properties.bounds.ne, state.properties.bounds.sw],
      zoomLevel: state.properties.zoom,
      center: state.properties.center,
    });
  };

  const onFilterChange = (filter: MapFilterType) => {
    analytics.logEvent('Map', 'Filter changed', {filter});
    props.vehicles?.onFilterChange(filter.mobility);
    props.stations?.onFilterChange(filter.mobility);
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
            <Vehicles
              mapCameraRef={mapCameraRef}
              vehicles={props.vehicles.vehicles}
              onClusterClick={(feature) => {
                onMapClick({
                  source: 'cluster-click',
                  feature,
                });
              }}
            />
          )}
          {props.stations && <Stations stations={props.stations.stations} />}
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          {(props.vehicles || props.stations) && (
            <MapFilter
              onFilterChanged={onFilterChange}
              isLoading={
                (props.vehicles?.isLoading || props.stations?.isLoading) ??
                false
              }
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
        </View>
      </View>
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
  pin: {...shadows},
}));
