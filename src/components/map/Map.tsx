import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  shadows,
  useControlPositionsStyle,
} from '@atb/components/map/index';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature} from 'geojson';
import React, {useMemo, useRef} from 'react';
import {View} from 'react-native';

import LocationBar from '@atb/components/map/LocationBar';
import useSelectedFeatureChangeEffect from './use-selected-feature-change-effect';
import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import {
  flyToLocation,
  isFeaturePoint,
  zoomIn,
  zoomOut,
} from '@atb/components/map/utils';
import {GeoLocation, Location, SearchLocation} from '@atb/favorites/types';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';
import SelectionPinConfirm from '@atb/assets/svg/color/map/SelectionPinConfirm';
import SelectionPinShadow from '@atb/assets/svg/color/map/SelectionPinShadow';

/**
 * MapSelectionMode: Parameter to decide how on-select/ on-click on the map
 * should behave
 *  - ExploreStops: If only the Stop Places (Bus, Trams stops etc.) should be
 *    interactable
 *  - ExploreLocation: If every selected location should be interactable. It
 *    also shows the Location bar on top of the Map to show the currently
 *    selected location
 */
export type MapSelectionMode = 'ExploreStops' | 'ExploreLocation';

type MapProps = {
  initialLocation?: Location;
  selectionMode: MapSelectionMode;
  onLocationSelect?: (selectedLocation?: GeoLocation | SearchLocation) => void;
};

const Map = ({initialLocation, selectionMode, onLocationSelect}: MapProps) => {
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

  const {mapLines, selectedCoordinates, onClick} =
    useSelectedFeatureChangeEffect(
      selectionMode,
      startingCoordinates,
      mapViewRef,
      mapCameraRef,
    );

  return (
    <View style={styles.container}>
      {selectionMode === 'ExploreLocation' && (
        <LocationBar
          coordinates={selectedCoordinates || startingCoordinates}
          onSelect={onLocationSelect}
        />
      )}
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          onPress={(feature: Feature) => {
            if (isFeaturePoint(feature)) {
              onClick(feature);
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
          {selectionMode === 'ExploreLocation' && selectedCoordinates && (
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
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          {currentLocation && (
            <PositionArrow
              onPress={() => {
                onClick(currentLocation.coordinates);
                flyToLocation(currentLocation.coordinates, 750, mapCameraRef);
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

export default Map;
