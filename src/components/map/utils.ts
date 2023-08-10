import {RefObject} from 'react';
import MapboxGL, {CameraAnimationMode} from '@rnmapbox/maps';
import {Expression} from '@rnmapbox/maps/src/utils/MapboxStyles';
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
import {
  Cluster,
  MapSelectionActionType,
  MapPadding,
  ParkingType,
} from './types';
import distance from '@turf/distance';
import {isVehicle} from '@atb/mobility/utils';

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
  padding: MapPadding = [100, 100],
) {
  mapCameraRef.current?.fitBounds(
    [fromCoordinates.longitude, fromCoordinates.latitude],
    [toCoordinates.longitude, toCoordinates.latitude],
    padding,
    1000,
  );
}

export const findEntityAtClick = async (
  clickedFeature: Feature<Point>,
  mapViewRef: RefObject<MapboxGL.MapView>,
) => {
  const renderedFeatures = await getFeaturesAtClick(
    clickedFeature,
    mapViewRef,
    ['==', ['geometry-type'], 'Point'],
  );
  return renderedFeatures?.filter(isFeaturePoint)[0];
};

export const isFeaturePoint = (f: Feature): f is Feature<Point> =>
  f.geometry.type === 'Point';

export const isClusterFeature = (
  feature: Feature,
): feature is Feature<Point, Cluster> =>
  isFeaturePoint(feature) && feature.properties?.cluster;

export const isStopPlace = (f: Feature<Point>) =>
  f.properties?.entityType === 'StopPlace';

export const isParkAndRide = (
  f: Feature<Point>,
): f is Feature<Point, ParkingType> => f.properties?.entityType === 'Parking';

export const isFeatureCollection = (obj: unknown): obj is FeatureCollection =>
  typeof obj === 'object' &&
  obj !== null &&
  'type' in obj &&
  typeof obj.type === 'string' &&
  obj.type === 'FeatureCollection';

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

  const featuresAtPoint = await mapViewRef.current.queryRenderedFeaturesAtPoint(
    point,
    filter,
    layerIds,
  );
  return featuresAtPoint?.features;
};

type FlyToLocationArgs = {
  coordinates: Coordinates | undefined;
  mapCameraRef: RefObject<MapboxGL.Camera>;
  zoomLevel?: number;
  animationDuration?: number;
  animationMode?: CameraAnimationMode;
};
export function flyToLocation({
  coordinates,
  mapCameraRef,
  zoomLevel,
  animationDuration,
  animationMode = 'flyTo',
}: FlyToLocationArgs) {
  coordinates &&
    mapCameraRef.current?.setCamera({
      centerCoordinate: [coordinates.longitude, coordinates.latitude],
      zoomLevel,
      animationMode,
      animationDuration: animationDuration ?? 750,
    });
}

export const toFeaturePoint = <
  T extends {id?: string; lat: number; lon: number},
>(
  item: T,
): GeoJSON.Feature<GeoJSON.Point, T> => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [item.lon, item.lat],
  },
  properties: item,
});

export const toFeaturePoints = <
  T extends {id: string; lat: number; lon: number},
>(
  items: T[],
) => items.map(toFeaturePoint);

export const toFeatureCollection = <
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
>(
  features: Array<Feature<G, P>>,
): FeatureCollection<G, P> => ({
  type: 'FeatureCollection',
  features,
});

/**
 * Calculates the distance in meters between the northern most point and the southern most point of the given bounds.
 * @param visibleBounds
 */
export const getVisibleRange = (visibleBounds: Position[]) => {
  const [[_, latNE], [lonSW, latSW]] = visibleBounds;
  return distance([lonSW, latSW], [lonSW, latNE], {units: 'meters'});
};

export const shouldShowMapLines = (entityFeature: Feature<Point>) =>
  !isVehicle(entityFeature);

export const shouldZoomToFeature = (entityFeature: Feature<Point>) =>
  !isVehicle(entityFeature);
