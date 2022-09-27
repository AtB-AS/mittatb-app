import {RefObject} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Coordinates} from '@atb/screens/TripDetails/Map/types';
import {Feature, Point} from 'geojson';

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
  mapCameraRef: RefObject<MapboxGL.Camera>,
  coordinates?: Coordinates,
  duration: number = 750,
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
) {
  mapCameraRef.current?.fitBounds(
    [fromCoordinates.longitude, fromCoordinates.latitude],
    [toCoordinates.longitude, toCoordinates.latitude],
    [100, 100],
    1000,
  );
}

export const isFeaturePoint = (f: Feature): f is Feature<Point> =>
  f.geometry.type === 'Point';
