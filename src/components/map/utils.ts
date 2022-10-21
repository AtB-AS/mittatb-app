import {RefObject} from 'react';
import MapboxGL, {Expression} from '@react-native-mapbox-gl/maps';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {Feature, Point, Position} from 'geojson';
import {FeatureOrCoordinates} from '@atb/components/map/types';
import {PixelRatio, Platform} from 'react-native';

export async function zoomIn(
  mapViewRef: RefObject<MapboxGL.MapView>,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) {
  const currentZoom = await mapViewRef.current?.getZoom();
  mapCameraRef.current?.zoomTo((currentZoom ?? 10) + 1, 200);
}

export async function zoomOut(
  mapViewRef: RefObject<MapboxGL.MapView>,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) {
  const currentZoom = await mapViewRef.current?.getZoom();
  mapCameraRef.current?.zoomTo((currentZoom ?? 10) - 1, 200);
}

export function flyToLocation(
  coordinates: Coordinates | undefined,
  duration: number = 750,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) {
  coordinates &&
    mapCameraRef.current?.flyTo(
      [coordinates.longitude, coordinates.latitude],
      duration,
    );
}

export function fitBounds(
  fromCoordinates: Coordinates,
  toCoordinates: Coordinates,
  mapCameraRef: RefObject<MapboxGL.Camera>,
  padding: MapboxGL.Padding = [100, 100],
) {
  mapCameraRef.current?.fitBounds(
    [fromCoordinates.longitude, fromCoordinates.latitude],
    [toCoordinates.longitude, toCoordinates.latitude],
    padding,
    1000,
  );
}

export const findClickedStopPlace = async (
  featureOrCoords: FeatureOrCoordinates,
  mapViewRef: RefObject<MapboxGL.MapView>,
) => {
  const renderedFeatures = await getFeaturesAtCoordinates(
    featureOrCoords,
    mapViewRef,
    ['==', ['geometry-type'], 'Point'],
  );
  return renderedFeatures
    ?.filter(isFeaturePoint)
    .find((feature) => feature?.properties?.entityType === 'StopPlace');
};

export const isFeaturePoint = (f: Feature): f is Feature<Point> =>
  f.geometry.type === 'Point';

export const mapPositionToCoordinates = (p: Position): Coordinates => ({
  longitude: p[0],
  latitude: p[1],
});

export const getCoordinatesFromFeatureOrCoordinates = (
  foc: FeatureOrCoordinates,
) =>
  isCoordinates(foc) ? foc : mapPositionToCoordinates(foc.geometry.coordinates);

export const isCoordinates = (foc: FeatureOrCoordinates): foc is Coordinates =>
  'latitude' in foc;

export const getFeaturesAtCoordinates = async (
  featureOrCoords: FeatureOrCoordinates,
  mapViewRef: RefObject<MapboxGL.MapView>,
  filter?: Expression,
  layerIds?: string[],
) => {
  if (!mapViewRef.current) return undefined;
  const coords = isCoordinates(featureOrCoords)
    ? featureOrCoords
    : mapPositionToCoordinates(featureOrCoords.geometry.coordinates);
  let point = await mapViewRef.current?.getPointInView([
    coords.longitude,
    coords.latitude,
  ]);
  if (Platform.OS == 'android') {
    // Necessary hack (https://github.com/react-native-mapbox-gl/maps/issues/1085)
    point = point.map((p) => p * PixelRatio.get());
  }
  const featuresAtPoint = await mapViewRef.current.queryRenderedFeaturesAtPoint(
    point,
    filter,
    layerIds,
  );
  return featuresAtPoint?.features;
};
