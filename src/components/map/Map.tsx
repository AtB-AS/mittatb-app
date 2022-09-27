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
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';

import LocationBar from '@atb/components/map/LocationBar';
import useWalkingRouteLines from '@atb/components/map/use-walking-route-lines';
import MapRoute from '@atb/screens/TripDetails/Map/MapRoute';
import {
  fitBounds,
  flyToLocation,
  isFeaturePoint,
  zoomIn,
  zoomOut,
} from '@atb/components/map/utils';

/**
 * MapSelectionMode: Parameter to decide how on-select/ on-click on the map should behave
 * ExploreStops: If only the Stop Places (Bus, Trams stops etc.)  should be interactable
 * ExploreLocation: If every selected location should be interactable
 */
export type MapSelectionMode = 'ExploreStops' | 'ExploreLocation';

type MapProps = {
  coordinates: Coordinates;
  shouldShowSearchBar?: boolean;
  selectionMode?: MapSelectionMode;
  onLocationSelect?: (selectedLocation?: any) => void;
  zoomLevel: number;
};

const Map = ({
  coordinates,
  selectionMode,
  onLocationSelect,
  zoomLevel,
}: MapProps) => {
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<Coordinates | null>(
      selectionMode === 'ExploreLocation' ? coordinates : null,
    );

  const {location: geolocation} = useGeolocationState();
  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);
  const styles = useMapStyles();
  const controlStyles = useControlPositionsStyle();
  const shouldShowWalkingRouteToStop = selectionMode === 'ExploreStops';
  const mapLines = useWalkingRouteLines(
    coordinates,
    selectedCoordinates,
    shouldShowWalkingRouteToStop,
  );

  useEffect(() => {
    if (!selectedCoordinates) return;
    if (mapLines) {
      fitBounds(coordinates, selectedCoordinates, mapCameraRef);
    } else {
      flyToLocation(mapCameraRef, selectedCoordinates);
    }
  }, [mapLines]);

  const onPress = async (feature: Feature) => {
    if (!isFeaturePoint(feature)) return;
    if (selectionMode === 'ExploreStops') {
      await selectStopPlace(feature);
    } else if (selectionMode === 'ExploreLocation') {
      selectPoint(feature);
    }
  };

  const selectPoint = (feature: Feature<Point>) => {
    setSelectedCoordinates({
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
    });
    const coordinates = feature.geometry.coordinates;
    flyToLocation(mapCameraRef, {
      longitude: coordinates[0],
      latitude: coordinates[1],
    });
  };

  async function selectStopPlace(feature: Feature<Point>) {
    setSelectedCoordinates(null);
    if (!feature.properties) return;
    const {screenPointX, screenPointY} = feature.properties;
    if (!screenPointX || !screenPointY) return;
    const renderedFeaturesResult =
      await mapViewRef?.current?.queryRenderedFeaturesAtPoint(
        [screenPointX, screenPointY],
        ['==', ['geometry-type'], 'Point'],
      );

    const stopPlaceFeature = renderedFeaturesResult?.features
      .filter(isFeaturePoint)
      .find(
        (featureAtPoint) =>
          featureAtPoint?.properties?.entityType === 'StopPlace',
      );

    if (stopPlaceFeature) {
      setSelectedCoordinates({
        longitude: stopPlaceFeature.geometry.coordinates[0],
        latitude: stopPlaceFeature.geometry.coordinates[1],
      });
    }
  }

  return (
    <View style={styles.container}>
      {selectionMode === 'ExploreLocation' && (
        <LocationBar
          coordinates={selectedCoordinates}
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
            centerCoordinate={[coordinates.longitude, coordinates.latitude]}
            {...MapCameraConfig}
          />
          {mapLines && <MapRoute lines={mapLines}></MapRoute>}
          <MapboxGL.UserLocation showsUserHeadingIndicator />
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          <PositionArrow
            flyToCurrentLocation={() =>
              flyToLocation(mapCameraRef, geolocation?.coordinates)
            }
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
