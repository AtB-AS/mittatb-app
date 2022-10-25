import {RefObject} from 'react';
import MapboxGL, {Expression} from '@react-native-mapbox-gl/maps';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {Feature, Point, Position} from 'geojson';
import {FeatureOrCoordinates} from '@atb/components/map/types';
import {PixelRatio, Platform} from 'react-native';
import {moveCameraToCoordinate} from './hooks/use-trigger-camera-move-effect';

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
  mapCameraRef: RefObject<MapboxGL.Camera>,
) {
  coordinates && moveCameraToCoordinate(mapCameraRef, coordinates, 0);
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
    [
      'all',
      ['==', ['geometry-type'], 'Point'],
      ['==', ['get', 'entityType'], 'StopPlace'],
    ],
  );
  let filteredFeatures = renderedFeatures?.filter(isFeaturePoint);

  return (
    filteredFeatures?.find(
      (feature) => feature.properties?.finalStopPlaceType === undefined,
    ) ?? filteredFeatures?.[0]
  );
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
  const bbox = calcBoundingBox(point, 10);
  const featuresAtPoint = await mapViewRef.current.queryRenderedFeaturesInRect(
    bbox,
    filter,
    layerIds,
  );
  return featuresAtPoint?.features;
};

export const calcBoundingBox = (point: GeoJSON.Position, offset: number) => {
  const [x, y] = point;
  return [y - offset, x - offset, y + offset, x + offset];
};
