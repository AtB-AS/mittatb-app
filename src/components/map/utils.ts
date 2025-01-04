import {RefObject} from 'react';
import MapboxGL, {CameraAnimationMode, CameraPadding} from '@rnmapbox/maps';
import {Expression} from '@rnmapbox/maps/src/utils/MapboxStyles';
import {Coordinates} from '@atb/utils/coordinates';
import {
  Feature,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson';
import {
  MapSelectionActionType,
  MapPadding,
  ParkingType,
  GeofencingZoneCustomProps,
} from './types';
import {
  ClusterOfVehiclesProperties,
  ClusterOfVehiclesPropertiesSchema,
} from '@atb/api/types/mobility';

export const hitboxCoveringIconOnly = {width: 1, height: 1};

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
  return renderedFeatures?.filter(isFeaturePoint)?.filter(hasProperties)[0];
};

export const isFeaturePoint = (f: Feature): f is Feature<Point> =>
  f.geometry.type === 'Point';

export const isFeaturePolygon = (f: Feature): f is Feature<Polygon> =>
  f.geometry.type === 'Polygon';

export const isFeatureMultiPolygon = (f: Feature): f is Feature<MultiPolygon> =>
  f.geometry.type === 'MultiPolygon';

/**
 * When including MultiPolygons in GeoJSON as shape prop for MapboxGL.ShapeSource,
 * they are rendered as multiple Features with geometry.type="Polygon".
 * So the GeoJSON input has type MultiPolygon, but queried features from the map have type Polygon
 * @param   {object}  feature GeoJson feature
 * @returns {boolean} whether a feature has properties.polylineEncodedMultiPolygon instead of geometry.coordinates. Only GeofencingZones are known to use this.
 */
export const isFeaturePolylineEncodedMultiPolygon = (f: Feature): boolean =>
  (isFeatureMultiPolygon(f) || isFeaturePolygon(f)) &&
  !!f.properties?.polylineEncodedMultiPolygon;

export const hasProperties = (f: Feature) =>
  Object.keys(f.properties || {}).length > 0;

export const hasGeofencingZoneCustomProps = (f: Feature) =>
  Object.keys(f.properties?.geofencingZoneCustomProps || {}).length > 0;

export const isGeofencingZoneFeature = (
  f: Feature,
): f is Feature<
  MultiPolygon,
  {geofencingZoneCustomProps: GeofencingZoneCustomProps}
> => isFeaturePolylineEncodedMultiPolygon(f) && hasGeofencingZoneCustomProps(f);

export const isClusterFeature = (
  feature: Feature,
): feature is Feature<Point, ClusterOfVehiclesProperties> =>
  ClusterOfVehiclesPropertiesSchema.safeParse(feature.properties).success;

export const isQuayFeature = (f: Feature<Geometry, GeoJsonProperties>) =>
  f.properties?.entityType === 'Quay';

export const isParkAndRideFeature = (
  f: Feature<Point>,
): f is Feature<Point, ParkingType> => f.properties?.entityType === 'Parking';

export const mapPositionToCoordinates = (p: Position): Coordinates => ({
  longitude: p[0],
  latitude: p[1],
});

export const getCoordinatesFromMapSelectionAction = (
  sc: MapSelectionActionType,
) => {
  switch (sc.source) {
    case 'my-position':
      return sc.coords;
    case 'map-click':
    case 'cluster-click':
      return mapPositionToCoordinates(sc.feature.geometry.coordinates);
    case 'filters-button':
    case 'external-map-button':
      return undefined;
  }
};

export const getFeaturesAtClick = async (
  clickedFeature: Feature<Point>,
  mapViewRef: RefObject<MapboxGL.MapView>,
  filter?: Expression,
  layerIds?: string[],
) => {
  if (!mapViewRef.current) return undefined;
  const coords = mapPositionToCoordinates(clickedFeature.geometry.coordinates);
  const point = await mapViewRef.current?.getPointInView([
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
  coordinates?: Coordinates;
  padding?: CameraPadding;
  mapCameraRef: RefObject<MapboxGL.Camera>;
  zoomLevel?: number;
  animationDuration?: number;
  animationMode?: CameraAnimationMode;
};
export function flyToLocation({
  coordinates,
  padding,
  mapCameraRef,
  zoomLevel,
  animationDuration,
  animationMode = 'flyTo',
}: FlyToLocationArgs) {
  coordinates &&
    mapCameraRef.current?.setCamera({
      centerCoordinate: [coordinates.longitude, coordinates.latitude],
      padding,
      zoomLevel,
      animationMode,
      animationDuration: animationDuration ?? 750,
    });
}

// export const isStopPlaceFeature = (f: Feature<Point>) => f.properties?.entityType === 'StopPlace';

// disable for now
export const shouldShowMapLines = (_entityFeature: Feature<Point>) => false; //isStationFeature(entityFeature) || isStopPlaceFeature(entityFeature);

// disable for now
export const shouldZoomToFeature = (_entityFeature: Feature<Point>) => false; //isStationFeature(entityFeature) || isStopPlaceFeature(entityFeature);
