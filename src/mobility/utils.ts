import {
  Feature,
  GeoJsonProperties,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  PricingPlanFragment,
  RentalUrisFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {getVisibleRange} from '@atb/components/map/utils';
import buffer from '@turf/buffer';
import bbox from '@turf/bbox-polygon';
import difference from '@turf/difference';
import {StationFragment} from '@atb/api/types/generated/fragments/stations';
import {Platform} from 'react-native';

export const isVehicle = (
  properties: GeoJsonProperties | undefined,
): properties is VehicleFragment => properties?.__typename === 'Vehicle';

export const isStation = (
  properties: GeoJsonProperties | undefined,
): properties is StationFragment => properties?.__typename === 'Station';

export const getRentalAppUri = <T extends {rentalUris?: RentalUrisFragment}>(
  t: T,
) => (Platform.OS === 'ios' ? t.rentalUris?.ios : t.rentalUris?.android);

export const hasMultiplePricingPlans = (plan: PricingPlanFragment) =>
  (plan.perKmPricing && plan.perMinPricing) ||
  (plan.perKmPricing && plan.perKmPricing.length > 1) ||
  (plan.perMinPricing && plan.perMinPricing.length > 1);

export const toBbox = (position: Position[]) => {
  const [[lonMax, latMax], [lonMin, latMin]] = position;
  return bbox([lonMin, latMin, lonMax, latMax]);
};

/**
 * Determines if vehicles need to be reloaded
 * @param visibleBounds Area currently visible in the map
 * @param loadedArea Area in which vehicles are already loaded.
 */
export const needsReload = (
  visibleBounds: Position[],
  loadedArea: Feature<Polygon | MultiPolygon> | undefined,
) => {
  if (!loadedArea) return true;
  // If the loaded area totally covers the current loaded bounds,
  // no reload is needed. In this case 'difference' will return null.
  const diff = difference(toBbox(visibleBounds), loadedArea);
  return Boolean(diff);
};

/**
 * Gets the radius to load vehicles within. Radius is calculated by
 * using the distance from the map center point to it's furthest edge,
 * and then add 'buffer' meters to load some vehicles outside the currently
 * visible bounds.
 * @param bbox Current visible bounds
 * @param buffer The number of meters to extend radius outside current bounds.
 */
export const getRadius = (bbox: Position[], buffer: number) => {
  const range = getVisibleRange(bbox);
  return Math.ceil(range / 2) + buffer;
};

export const extend = (midpoint: Feature<Point>, range: number) =>
  buffer(midpoint, range, {units: 'meters'});
