import {Feature, Point, Polygon, Position} from 'geojson';
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
import bbox from '@turf/bbox-polygon';
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

export const constructBenefitAppUrl = ({
  benefitUrl,
  rentalAppUri,
}: {
  benefitUrl: string;
  rentalAppUri: string;
}) => {
  const [rentalBase, rentalParams] = rentalAppUri.split('?');
  // eslint-disable-next-line prefer-const
  let [benefitBase, benefitParams] = benefitUrl.split('?');

  const urlBase = benefitBase.replace('{APP_URL}', rentalBase);
  const urlParams = rentalParams
    .split('&')
    .concat(benefitParams.split('&'))
    .join('&');
  return `${urlBase}?${urlParams}`;
};

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
  loadedArea: Feature<Polygon> | undefined,
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

export type AreaState = {
  lat: number;
  lon: number;
  zoom: number;
  range: number;
  visibleBounds: Position[];
  loadedArea: Feature<Polygon> | undefined;
};

export const updateAreaState = (
  region: MapRegion,
  bufferDistance: number,
  minZoomLevel: number,
) => {
  return (previousState: AreaState | undefined) => {
    if (region.zoomLevel < minZoomLevel) {
      return undefined;
    }

    const visibleBounds = region.visibleBounds;
    if (!needsReload(visibleBounds, previousState?.loadedArea)) {
      return previousState;
    }

    const [lon, lat] = region.center;
    const range = getRadius(visibleBounds, bufferDistance);
    return {
      lat,
      lon,
      zoom: region.zoomLevel,
      range,
      visibleBounds,
      loadedArea: extend(toFeaturePoint({lat, lon}), range),
    };
  };
};

export const formatRange = (rangeInMeters: number, language: Language) => {
  const rangeInKm =
    rangeInMeters > 5000
      ? (rangeInMeters / 1000).toFixed(0)
      : formatDecimalNumber(rangeInMeters / 1000, language, 1);
  return `ca. ${rangeInKm} km`;
};

export const getOperators = (
  filter: MobilityMapFilterType,
  formFactor: FormFactor,
) => filter[formFactor]?.operators ?? [];

export const isShowAll = (
  filter: MobilityMapFilterType,
  formFactor: FormFactor,
) => !!filter[formFactor]?.showAll;
