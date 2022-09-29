import {
  MapCameraConfig,
  MapControls,
  MapViewConfig,
  PositionArrow,
  useControlPositionsStyle,
} from '@atb/components/map/index';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import {Coordinates} from '@entur/sdk';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Feature, Point} from 'geojson';
import React, {useRef, useState, useMemo} from 'react';
import {View} from 'react-native';

import LocationBar from '@atb/components/map/LocationBar';
import useSelectedFeatureChangeEffect from './use-selected-feature-change-effect';
import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import {
  flyToLocation,
  isFeaturePoint,
  mapPositionToCoordinates,
  zoomIn,
  zoomOut,
} from '@atb/components/map/utils';
import {GeoLocation, SearchLocation} from '@atb/favorites/types';
import {FOCUS_ORIGIN} from '@atb/api/geocoder';

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
  initialCoordinates: Coordinates;
  selectionMode: MapSelectionMode;
  onLocationSelect?: (selectedLocation?: GeoLocation | SearchLocation) => void;
  zoomLevel: number;
};

const Map = ({
  initialCoordinates,
  selectionMode,
  onLocationSelect,
  zoomLevel,
}: MapProps) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature<Point>>();
  const {location: currentLocation} = useGeolocationState();

  const firstCoordinates = useMemo(() => {
    return initialCoordinates || currentLocation?.coordinates || FOCUS_ORIGIN;
  }, []);

  const [fromCoordinates, setFromCoordinates] = useState(
    currentLocation?.coordinates,
  );

  const {location: geolocation} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();
  const mapLines = useSelectedFeatureChangeEffect(
    fromCoordinates,
    selectedFeature,
    selectionMode,
    mapViewRef,
    mapCameraRef,
  );

  const onPress = async (feature: Feature) => {
    if (!isFeaturePoint(feature)) return;
    setSelectedFeature(feature);
    setFromCoordinates(fromCoordinates);
  };

  return (
    <View style={styles.container}>
      {selectionMode === 'ExploreLocation' && (
        <LocationBar
          coordinates={
            selectedFeature
              ? mapPositionToCoordinates(selectedFeature.geometry.coordinates)
              : firstCoordinates
          }
          onSelect={onLocationSelect}
        />
      )}
      <View style={{flex: 1}}>
        <MapboxGL.MapView
          ref={mapViewRef}
          style={{
            flex: 1,
          }}
          onPress={onPress}
          {...MapViewConfig}
        >
          <MapboxGL.Camera
            ref={mapCameraRef}
            zoomLevel={zoomLevel}
            centerCoordinate={[
              firstCoordinates.longitude,
              firstCoordinates.latitude,
            ]}
            {...MapCameraConfig}
          />
          {mapLines && <MapRoute lines={mapLines} />}
          <MapboxGL.UserLocation showsUserHeadingIndicator />
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          <PositionArrow
            onPress={() => {
              setSelectedFeature(undefined);
              flyToLocation(geolocation?.coordinates, 750, mapCameraRef);
            }}
          />
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
}));

export default Map;
