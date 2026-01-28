import {RefObject} from 'react';
import MapboxGL, {CameraAnimationMode, CameraPadding} from '@rnmapbox/maps';
import {
  Expression,
  SymbolLayerStyleProps,
} from 'node_modules/@rnmapbox/maps/src/utils/MapboxStyles';
import {Coordinates} from '@atb/utils/coordinates';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Geometry,
  Point,
  Polygon,
  Position,
} from 'geojson';
import {
  ParkingType,
  AutoSelectableMapItem,
  GeofencingZoneCustomProps,
} from './types';
import {
  ClusterOfVehiclesProperties,
  ClusterOfVehiclesPropertiesSchema,
} from '@atb/api/types/mobility';
import turfBooleanPointInPolygon from '@turf/boolean-point-in-polygon';
import distance from '@turf/distance';
import {
  isBicycleV2,
  isCarStationV2,
  isScooterV2,
  isStationV2,
  isVehiclesClusteredFeature,
} from '@atb/modules/mobility';
import {MapBottomSheetType} from './MapContext';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import z from 'zod';
import {GeofencingZoneCode} from '@atb-as/theme';

export const hitboxCoveringIconOnly = {width: 1, height: 1};

export const CUSTOM_SCAN_ZOOM_LEVEL = 17;

export const isFeaturePoint = (f: Feature): f is Feature<Point> =>
  f.geometry.type === 'Point';

export const isFeaturePolygon = (f: Feature): f is Feature<Polygon> =>
  f.geometry.type === 'Polygon';

export const isFeatureMultiPolygon = (f: Feature): f is Feature<MultiPolygon> =>
  f.geometry.type === 'MultiPolygon';

/**
 * When including MultiPolygons in GeoJSON as shape prop for MapboxGL.ShapeSource,
 * they are rendered as multiple Features with geometry type of "Polygon".
 * So the GeoJSON input has type MultiPolygon, but queried features from the map have type Polygon
 * @param   {object}  f GeoJson feature
 * @returns {boolean} whether a feature has properties.polylineEncodedMultiPolygon instead of geometry.coordinates. Only GeofencingZones are known to use this.
 */
export const isFeaturePolylineEncodedMultiPolygon = (f: Feature): boolean =>
  (isFeatureMultiPolygon(f) || isFeaturePolygon(f)) &&
  !!f.properties?.polylineEncodedMultiPolygon;

export const hasGeofencingZoneCustomProps = (f: Feature) =>
  Object.keys(f.properties?.geofencingZoneCustomProps || {}).length > 0;

export const isFeatureGeofencingZone = (
  f: Feature,
): f is Feature<
  MultiPolygon,
  {geofencingZoneCustomProps: GeofencingZoneCustomProps}
> => isFeaturePolylineEncodedMultiPolygon(f) && hasGeofencingZoneCustomProps(f);

export const geofencingZoneCodes: GeofencingZoneCode[] = [
  'allowed',
  'slow',
  'noParking',
  'noEntry',
];
const GeofencingZonePropsSchema = z.object({
  code: z.enum(geofencingZoneCodes),
  systemId: z.string(),
});
export type GeofencingZoneProps = z.infer<typeof GeofencingZonePropsSchema>;
export const isFeatureGeofencingZoneAsTiles = (
  feature: Feature,
): feature is Feature<Point, GeofencingZoneProps> =>
  GeofencingZonePropsSchema.safeParse(feature.properties).success;

export const isClusterFeatureV2 = (
  feature: Feature,
): feature is Feature<Point, ClusterOfVehiclesProperties> =>
  ClusterOfVehiclesPropertiesSchema.safeParse(feature.properties).success;

export const isStopPlace = (f: Feature<Point>) =>
  f.properties?.entityType === 'StopPlace';

export const isQuayFeature = (f: Feature<Geometry, GeoJsonProperties>) =>
  f.properties?.entityType === 'Quay';

export const isParkAndRide = (
  f: Feature<Point> | undefined,
): f is Feature<Point, ParkingType> => f?.properties?.entityType === 'Parking';

export const mapPositionToCoordinates = (p: Position): Coordinates => ({
  longitude: p[0],
  latitude: p[1],
});

export const getFeaturesAtPoint = async (
  point: Position, // [lon, lat]
  mapViewRef: RefObject<MapboxGL.MapView | null>,
  filter?: Expression,
  layerIds?: string[],
) => {
  if (!mapViewRef.current) return undefined;

  const screenPoint = await mapViewRef.current?.getPointInView(point);

  const featuresAtPoint = await mapViewRef.current.queryRenderedFeaturesAtPoint(
    screenPoint,
    filter,
    layerIds,
  );

  return featuresAtPoint?.features;
};

function mapMapBottomSheetTypeToFormFactor(
  mapBottomSheetType?: MapBottomSheetType,
): FormFactor | undefined {
  switch (mapBottomSheetType) {
    case MapBottomSheetType.Bicycle:
      return FormFactor.Bicycle;
    case MapBottomSheetType.Scooter:
      return FormFactor.Scooter;
    case MapBottomSheetType.BikeStation:
      return FormFactor.Bicycle;
    case MapBottomSheetType.CarStation:
      return FormFactor.Car;
    default:
      return undefined;
  }
}

export const getFeatureFromScan = (
  mapItem: AutoSelectableMapItem,
  mapBottomSheetType: MapBottomSheetType,
): Feature<Point, GeoJsonProperties> => {
  const feature: Feature<Point, GeoJsonProperties> = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [mapItem?.lon, mapItem?.lat],
    },
    // properties should match the one received from the map onPressEvent
    properties: {
      id: mapItem.id,
      system_id: mapItem?.system.id,
      count: 1,
      vehicle_type_form_factor:
        mapMapBottomSheetTypeToFormFactor(mapBottomSheetType),
    },
  };

  return feature;
};

/**
 * Gets features at a clicked location
 */
export const getFeaturesAtClick = async (
  clickedFeature: Feature<Point>,
  mapViewRef: RefObject<MapboxGL.MapView | null>,
  filter?: Expression,
  layerIds?: string[],
) => {
  const coords = mapPositionToCoordinates(clickedFeature.geometry.coordinates);
  return getFeaturesAtPoint(
    [coords.longitude, coords.latitude],
    mapViewRef,
    filter,
    layerIds,
  );
};

type FlyToLocationArgs = {
  coordinates?: Coordinates;
  padding?: CameraPadding;
  mapCameraRef: RefObject<MapboxGL.Camera | null>;
  mapViewRef: RefObject<MapboxGL.MapView | null>;
  zoomLevel?: number;
  animationDuration?: number;
  animationMode?: CameraAnimationMode;
};

export function flyToLocation({
  coordinates,
  padding,
  mapCameraRef,
  mapViewRef,
  zoomLevel,
  animationDuration,
  animationMode = 'flyTo',
}: FlyToLocationArgs) {
  if (!coordinates) return;

  mapViewRef.current?.getCenter().then((currentCenter) => {
    if (!currentCenter) return;

    const distanceToTarget = distance(
      [currentCenter[0], currentCenter[1]],
      [coordinates.longitude, coordinates.latitude],
      {units: 'kilometers'},
    );

    if (distanceToTarget <= 2) {
      animationMode = 'easeTo';
    } else if (distanceToTarget <= 6) {
      animationMode = 'flyTo';
    } else {
      animationMode = 'moveTo';
    }

    const dynamicDuration = Math.min(
      Math.max(750, Math.round(distanceToTarget * 150)),
      2000,
    );

    mapCameraRef.current?.setCamera({
      centerCoordinate: [coordinates.longitude, coordinates.latitude],
      padding,
      zoomLevel,
      animationMode: animationMode,
      animationDuration: animationDuration ?? dynamicDuration,
    });
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

export function getFeatureToSelect(
  featuresAtClick: Feature<Geometry, GeoJsonProperties>[],
  positionClicked: Position, // [lon, lat]
) {
  const featureToSelect = featuresAtClick.reduce((selected, currentFeature) =>
    getFeatureWeight(currentFeature, positionClicked) >
    getFeatureWeight(selected, positionClicked)
      ? currentFeature
      : selected,
  );
  return featureToSelect;
}

export function getFeatureWeight(
  feature: Feature,
  positionClicked: Position,
): number {
  if (isFeaturePoint(feature)) {
    return isStopPlace(feature) ||
      isVehiclesClusteredFeature(feature) ||
      isScooterV2(feature) ||
      isBicycleV2(feature) ||
      isStationV2(feature) ||
      isCarStationV2(feature) ||
      isParkAndRide(feature)
      ? 3
      : 1;
  } else if (isFeatureGeofencingZone(feature)) {
    // note: This case never happens when enable_geofencing_zones_as_tiles is true.
    // Can just return 0 after removing the old solution
    const positionClickedIsInsideGeofencingZone = turfBooleanPointInPolygon(
      positionClicked,
      feature.geometry,
    );
    return positionClickedIsInsideGeofencingZone ? 2 : 0;
  } else {
    return 0;
  }
}

/*
 * Standardized calculations for icon size and opacity zoom transitions.
 */
export function getIconZoomTransitionStyle(
  reachFullScaleAtZoomLevel: number,
  iconFullSize: number | Expression,
  scaleTransitionZoomRange: number,
  opacityTransitionExtraZoomRange: number,
): Required<Pick<SymbolLayerStyleProps, 'iconSize' | 'iconOpacity'>> {
  const iconOpacity: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    0,
    reachFullScaleAtZoomLevel -
      scaleTransitionZoomRange +
      opacityTransitionExtraZoomRange,
    1,
  ];

  const iconSize: Expression = [
    'interpolate',
    ['linear'],
    ['zoom'],
    reachFullScaleAtZoomLevel - scaleTransitionZoomRange,
    0.3,
    reachFullScaleAtZoomLevel,
    iconFullSize,
  ];

  return {
    iconSize,
    iconOpacity,
  };
}
