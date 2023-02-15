import {RefObject} from 'react';
import MapboxGL, {Expression} from '@react-native-mapbox-gl/maps';
import {Coordinates} from '@atb/utils/coordinates';
import {
  Feature,
  FeatureCollection,
  GeoJSON,
  GeoJsonProperties,
  Geometry,
  Point,
  Position,
} from 'geojson';
import {Cluster, MapSelectionActionType} from './types';
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

export const findStopPlaceAtClick = async (
  clickedFeature: Feature<Point>,
  mapViewRef: RefObject<MapboxGL.MapView>,
) => {
  const renderedFeatures = await getFeaturesAtClick(
    clickedFeature,
    mapViewRef,
    ['==', ['geometry-type'], 'Point'],
  );
  return renderedFeatures
    ?.filter(isFeaturePoint)
    .find((feature) => feature?.properties?.entityType === 'StopPlace');
};

export const isFeaturePoint = (f: Feature): f is Feature<Point> =>
  f.geometry.type === 'Point';

export const isClusterFeature = (
  feature: Feature,
): feature is Feature<Point, Cluster> => feature.properties?.cluster;

export const mapPositionToCoordinates = (p: Position): Coordinates => ({
  longitude: p[0],
  latitude: p[1],
});

export const getCoordinatesFromMapSelectionAction = (
  sc: MapSelectionActionType,
) =>
  sc.source === 'my-position'
    ? sc.coords
    : mapPositionToCoordinates(sc.feature.geometry.coordinates);

export const getFeaturesAtClick = async (
  clickedFeature: Feature<Point>,
  mapViewRef: RefObject<MapboxGL.MapView>,
  filter?: Expression,
  layerIds?: string[],
) => {
  if (!mapViewRef.current) return undefined;
  const coords = mapPositionToCoordinates(clickedFeature.geometry.coordinates);
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

export function flyToLocation(
  coordinates: Coordinates | undefined,
  mapCameraRef: RefObject<MapboxGL.Camera>,
) {
  coordinates &&
    mapCameraRef.current?.flyTo(
      [coordinates.longitude, coordinates.latitude],
      750,
    );
}

export const toGeoJSONFeature = <
  T extends {id: string; lat: number; lon: number},
>(
  properties: T[],
) =>
  properties.map<GeoJSON.Feature<GeoJSON.Point, T>>((p) => ({
    id: p.id,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [p.lon, p.lat],
    },
    properties: p,
  }));

export const toFeatureCollection = <
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
>(
  features: Array<Feature<G, P>>,
): FeatureCollection<G, P> => ({
  type: 'FeatureCollection',
  features,
});
