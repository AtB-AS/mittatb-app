import {Feature, Point, Position} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  PricingPlanFragment,
  RentalUrisFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {
  FormFactorFilterType,
  getVisibleRange,
  MapRegion,
  MobilityMapFilterType,
  toFeaturePoint,
} from '@atb/components/map';
import buffer from '@turf/buffer';
import difference from '@turf/difference';
import {featureCollection} from '@turf/helpers';
import {Platform} from 'react-native';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {
  StationBasicFragment,
  VehicleTypeAvailabilityBasicFragment,
} from '@atb/api/types/generated/fragments/stations';
import {Language} from '@atb/translations';
import {formatNumberToString} from '@atb/utils/numbers';
import {enumFromString} from '@atb/utils/enum-from-string';
import {MobilityOperatorType} from '@atb-as/config-specs/lib/mobility';
import {
  BatteryEmpty,
  BatteryFull,
  BatteryHigh,
  BatteryLow,
  BatteryMedium,
} from '@atb/assets/svg/mono-icons/miscellaneous';

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
  t: T | undefined | null,
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

  if (!prevAreaFeature || !newAreaFeature) return true;

  // If the previous area covers the new area the 'difference' will return null
  const diff = difference(featureCollection([newAreaFeature, prevAreaFeature]));
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
      : formatNumberToString(rangeInMeters / 1000, language, 0, 1);
  return `${rangeInKm} km`;
};

const getPercentageBattery = (batteryPercentage: number) => {
  let newBatteryPercentage = batteryPercentage;
  if (batteryPercentage % 1 !== 0 && batteryPercentage < 1) {
    newBatteryPercentage = batteryPercentage * 100;
  } else if (batteryPercentage % 1 !== 0) {
    newBatteryPercentage = Math.round(batteryPercentage);
  }
  return newBatteryPercentage;
};

export const getBatteryLevelIcon = (batteryPercentage: number) => {
  const newBatteryPercentage = getPercentageBattery(batteryPercentage);

  if (newBatteryPercentage >= 77) {
    return BatteryFull;
  } else if (newBatteryPercentage >= 36) {
    return BatteryHigh;
  } else if (newBatteryPercentage >= 16) {
    return BatteryMedium;
  } else if (newBatteryPercentage >= 3) {
    return BatteryLow;
  } else {
    return BatteryEmpty;
  }
};

export const formatPricePerUnit = (
  pricePlan: PricingPlanFragment,
  language: Language,
) => {
  const perMinPrice = pricePlan.perMinPricing?.[0];
  const perKmPrice = pricePlan.perKmPricing?.[0];

  if (perMinPrice) {
    return {
      price: `${formatNumberToString(perMinPrice.rate, language)} kr`,
      unit: 'min',
    };
  }
  if (perKmPrice) {
    return {
      price: `${formatNumberToString(perKmPrice.rate, language)} kr`,
      unit: 'km',
    };
  }
  return undefined;
};

export const getOperators = (
  filter: MobilityMapFilterType,
  formFactor: FormFactor,
) => filter[formFactor]?.operators ?? [];

export const isShowAll = (
  filter: MobilityMapFilterType,
  formFactor: FormFactor,
) => !!filter[formFactor]?.showAll;

export const toFormFactorEnum = (str: string): FormFactor =>
  enumFromString(FormFactor, str) || FormFactor.Other;

export const getNewFilterState = (
  isChecked: boolean,
  selectedOperator: string,
  currentFilter: FormFactorFilterType | undefined,
  allOperators: MobilityOperatorType[],
): FormFactorFilterType => {
  if (isChecked) {
    // Add checked operator to list
    const operators = [...(currentFilter?.operators ?? []), selectedOperator];
    // If all operators are checked, set 'showAll' to true, rather that having all operators explicitly in the list.
    // This allows for showing operators that do not exist in the whitelist
    return operators.length === allOperators.length
      ? {
          operators: [],
          showAll: true,
        }
      : {
          operators,
          showAll: false,
        };
  }
  // If only one operator exists, treat unselecting this as unselecting all
  if (allOperators.length === 1) {
    return {
      operators: [],
      showAll: false,
    };
  }
  // If 'showAll' was true at the time of unchecking one, all other operators should be added to the list.
  const operators = currentFilter?.showAll
    ? allOperators.map((o) => o.id).filter((o) => o !== selectedOperator)
    : currentFilter?.operators?.filter((o: string) => o !== selectedOperator) ??
      [];
  return {
    operators,
    showAll: false,
  };
};
