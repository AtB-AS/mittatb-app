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
import React, {useRef, useState} from 'react';
import {View} from 'react-native';

import LocationBar from '@atb/components/map/LocationBar';
import WalkingRoute from '@atb/components/map/WalkingRoute';

/**
 * MapSelectionMode: Parameter to decide how on-select/ on-click on the map should behave
 * ExploreStops: If only the Stop Places (Bus, Trams stops etc.)  should be interactable
 * ExploreLocation: If every selected location should be interactable
 */
type MapSelectionMode = 'ExploreStops' | 'ExploreLocation';

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

  async function zoomIn() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) + 1, 200);
  }

  async function zoomOut() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) - 1, 200);
  }

  async function flyToCurrentLocation() {
    geolocation &&
      mapCameraRef.current?.flyTo(
        [geolocation.coordinates.longitude, geolocation.coordinates.latitude],
        750,
      );
  }

  const onPress = async (feature: Feature) => {
    if (!isFeaturePoint(feature)) return;
    if (selectionMode === 'ExploreStops') {
      await selectStopPlace(feature);
    } else if (selectionMode === 'ExploreLocation') {
      selectPoint(feature);
    }
  };

  const isFeaturePoint = (f: Feature): f is Feature<Point> =>
    f.geometry.type === 'Point';

  const selectPoint = (feature: Feature<Point>) => {
    setSelectedCoordinates({
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
    });
    mapCameraRef.current?.flyTo(feature.geometry.coordinates, 300);
  };

  async function selectStopPlace(feature: Feature<Point>) {
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
      mapCameraRef.current?.fitBounds(
        [coordinates.longitude, coordinates.latitude],
        stopPlaceFeature.geometry.coordinates,
        [100, 100],
        1000,
      );
    }
  }

  const shouldShowWalkingRouteToStop =
    selectionMode === 'ExploreStops' && selectedCoordinates;

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
          {shouldShowWalkingRouteToStop && (
            <WalkingRoute
              fromCoordinates={coordinates}
              toCoordinates={selectedCoordinates}
            ></WalkingRoute>
          )}
          <MapboxGL.UserLocation showsUserHeadingIndicator />
        </MapboxGL.MapView>
        <View style={controlStyles.controlsContainer}>
          <PositionArrow flyToCurrentLocation={flyToCurrentLocation} />
          <MapControls zoomIn={zoomIn} zoomOut={zoomOut} />
        </View>
      </View>
    </View>
  );
};

const useMapStyles = StyleSheet.createThemeHook(() => ({
  container: {flex: 1},
}));

export default Map;
