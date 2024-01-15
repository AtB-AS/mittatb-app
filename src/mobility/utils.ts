import {Feature, Point, Position} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  PricingPlanFragment,
  RentalUrisFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {
  getVisibleRange,
  MapRegion,
  MobilityMapFilterType,
  toFeaturePoint,
} from '@atb/components/map';
import buffer from '@turf/buffer';
import difference from '@turf/difference';
import {Platform} from 'react-native';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {
  StationBasicFragment,
  VehicleTypeAvailabilityBasicFragment,
} from '@atb/api/types/generated/fragments/stations';
import {Language} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';

export const isScooter = (
  feature: Feature<Point> | undefined,
): feature is Feature<Point, VehicleBasicFragment> =>
  feature?.properties?.vehicleType?.formFactor === FormFactor.Scooter ||
  feature?.properties?.vehicleType?.formFactor === FormFactor.ScooterStanding;

export const isBicycle = (
  feature: Feature<Point> | undefined,
): feature is Feature<Point, VehicleBasicFragment> =>
  feature?.properties?.vehicleType?.formFactor === FormFactor.Bicycle &&
  !isStation(feature);

export const isStation = (
  feature: Feature<Point> | undefined,
): feature is Feature<Point, StationBasicFragment> =>
  feature?.properties?.__typename === 'Station';

export const isBikeStation = (
  feature: Feature<Point> | undefined,
): feature is Feature<Point, StationBasicFragment> =>
  (isStation(feature) &&
    feature.properties?.vehicleTypesAvailable?.some(
      (types) => types.vehicleType.formFactor === FormFactor.Bicycle,
    )) ??
  false;

export const isCarStation = (
  feature: Feature<Point> | undefined,
): feature is Feature<Point, StationBasicFragment> =>
  (isStation(feature) &&
    feature.properties?.vehicleTypesAvailable?.some(
      (types) => types.vehicleType.formFactor === FormFactor.Car,
    )) ??
  false;

export const getAvailableVehicles = (
  types: VehicleTypeAvailabilityBasicFragment[] | undefined,
  formFactor: FormFactor,
) =>
  types
    ?.filter((type) => type.vehicleType.formFactor === formFactor)
    .map((type) => type.count)
    .reduce((sum, count) => sum + count, 0) ?? 0;

export const getRentalAppUri = <T extends {rentalUris?: RentalUrisFragment}>(
  t: T | undefined,
) => (Platform.OS === 'ios' ? t?.rentalUris?.ios : t?.rentalUris?.android);

export const hasMultiplePricingPlans = (plan: PricingPlanFragment) =>
  (plan.perKmPricing && plan.perMinPricing) ||
  (plan.perKmPricing && plan.perKmPricing.length > 1) ||
  (plan.perMinPricing && plan.perMinPricing.length > 1);

/**
 * Determines if vehicles need to be reloaded, by checking if the
 * previously loaded area covers the shown area.
 *
 * @param prevArea Area in which vehicles are already loaded
 * @param shownArea Area currently visible in the map
 * @return false if the previous area covers the shown area and no reload is
 * needed, otherwise true
 */
export const needsReload = (
  prevArea: AreaState | undefined,
  shownArea: AreaState,
): boolean => {
  if (!prevArea) return true;

  const prevAreaFeature = extend(
    toFeaturePoint({lat: prevArea.lat, lon: prevArea.lon}),
    prevArea.range,
  );
  const newAreaFeature = extend(
    toFeaturePoint({lat: shownArea.lat, lon: shownArea.lon}),
    shownArea.range,
  );

  // If the previous area covers the new area the 'difference' will return null
  const diff = difference(newAreaFeature, prevAreaFeature);
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

export type AreaState = {
  lat: number;
  lon: number;
  range: number;
};

export const updateAreaState = (
  region: MapRegion,
  bufferDistance: number,
  minZoomLevel: number,
) => {
  return (prevArea: AreaState | undefined): AreaState | undefined => {
    if (region.zoomLevel < minZoomLevel) return undefined;

    const shownArea = mapRegionToArea(region, 0);
    return needsReload(prevArea, shownArea)
      ? mapRegionToArea(region, bufferDistance)
      : prevArea;
  };
};

const mapRegionToArea = (
  region: MapRegion,
  bufferDistance: number,
): AreaState => {
  const [lon, lat] = region.center;
  const range = getRadius(region.visibleBounds, bufferDistance);
  return {lat, lon, range};
};

export const formatRange = (rangeInMeters: number, language: Language) => {
  const rangeInKm =
    rangeInMeters > 5000
      ? (rangeInMeters / 1000).toFixed(0)
      : formatDecimalNumber(rangeInMeters / 1000, language, 1);
  return `${rangeInKm} km`;
};

export const getOperators = (
  filter: MobilityMapFilterType,
  formFactor: FormFactor,
) => filter[formFactor]?.operators ?? [];

export const isShowAll = (
  filter: MobilityMapFilterType,
  formFactor: FormFactor,
) => !!filter[formFactor]?.showAll;
