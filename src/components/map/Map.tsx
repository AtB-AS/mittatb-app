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
import MapboxGL, {Point} from '@react-native-mapbox-gl/maps';
import {Feature, Position} from 'geojson';
import React, {useRef, useState} from 'react';
import {View} from 'react-native';

import LocationBar from '@atb/components/map/LocationBar';
import WalkingRoute from '@atb/components/map/WalkingRoute';

type MapProps = {
  coordinates: Coordinates;
  shouldShowSearchBar?: boolean;
  shouldExploreTripFromStops?: boolean;
  shouldSelectLocation?: boolean;
  onLocationSelect?: (selectedLocation?: any) => void;
  zoomLevel: number;
};

const Map = ({
  coordinates,
  shouldShowSearchBar,
  shouldExploreTripFromStops,
  shouldSelectLocation,
  onLocationSelect,
  zoomLevel,
}: MapProps) => {
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<Coordinates | null>(shouldSelectLocation ? coordinates : null);

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
    if (shouldExploreTripFromStops) {
      await selectStopPlace(feature);
    } else if (shouldSelectLocation) {
      selectPoint(feature);
    }
  };

  const selectPoint = (feature: Feature) => {
    if (feature && feature.geometry.type === 'Point') {
      setSelectedCoordinates({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
      });
      mapCameraRef.current?.flyTo(feature.geometry.coordinates, 300);
    }
  };

  async function selectStopPlace(feature: any) {
    const {screenPointX, screenPointY} = feature.properties;
    const renderedFeaturesResult =
      await mapViewRef?.current?.queryRenderedFeaturesAtPoint(
        [screenPointX, screenPointY],
        ['==', ['geometry-type'], 'Point'],
      );

    renderedFeaturesResult?.features.map(async (featureAtPoint) => {
      if (
        featureAtPoint.geometry.type === 'Point' &&
        featureAtPoint?.properties?.entityType === 'StopPlace'
      ) {
        setSelectedCoordinates({
          longitude: featureAtPoint.geometry.coordinates[0],
          latitude: featureAtPoint.geometry.coordinates[1],
        });
        mapCameraRef.current?.fitBounds(
          [coordinates.longitude, coordinates.latitude],
          featureAtPoint.geometry.coordinates,
          [100, 100],
          1000,
        );
      }
    });
  }

  const shouldShowWalkingRoute =
    shouldExploreTripFromStops && selectedCoordinates;

  return (
    <View style={styles.container}>
      {shouldShowSearchBar && (
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
          {shouldShowWalkingRoute && (
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
