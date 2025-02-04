import {Feature, Point} from 'geojson';
import {
  PricingPlanFragment,
  RentalUrisFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {FormFactorFilterType, MobilityMapFilterType} from '@atb/components/map';
import buffer from '@turf/buffer';
import {Platform} from 'react-native';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {VehicleTypeAvailabilityBasicFragment} from '@atb/api/types/generated/fragments/stations';
import {Language} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {enumFromString} from '@atb/utils/enum-from-string';
import {
  StationFeatureSchema,
  StationFeature,
  VehiclesClusteredFeatureSchema,
  VehiclesClusteredFeature,
  VehicleFeature,
  VehicleFeatureSchema,
} from '@atb/api/types/mobility';
import {MobilityOperatorType} from '@atb-as/config-specs/lib/mobility'; // import {MobilityOperatorType} from '@atb-as/config-specs/lib/mobility-operators';
import {
  BatteryEmpty,
  BatteryFull,
  BatteryHigh,
  BatteryLow,
  BatteryMedium,
} from '@atb/assets/svg/mono-icons/miscellaneous';

export const isVehiclesClusteredFeature = (
  feature: Feature<Point> | undefined,
): feature is VehiclesClusteredFeature =>
  VehiclesClusteredFeatureSchema.safeParse(feature).success;

export const isVehicleFeature = (
  feature: Feature<Point> | undefined,
): feature is VehicleFeature => VehicleFeatureSchema.safeParse(feature).success;

export const isScooterFeature = (
  feature: Feature<Point> | undefined,
): feature is VehicleFeature & {
  properties: {
    vehicle_type_form_factor: FormFactor.Scooter | FormFactor.ScooterStanding;
  };
} =>
  isVehicleFeature(feature) &&
  (feature?.properties?.vehicle_type_form_factor === FormFactor.Scooter ||
    feature?.properties?.vehicle_type_form_factor ===
      FormFactor.ScooterStanding);

export const isBicycleFeature = (
  feature: Feature<Point> | undefined,
): feature is VehicleFeature & {
  properties: {vehicle_type_form_factor: FormFactor.Bicycle};
} =>
  isVehiclesClusteredFeature(feature) &&
  feature?.properties?.vehicle_type_form_factor === FormFactor.Bicycle &&
  !isStationFeature(feature);

export const isStationFeature = (
  feature: Feature<Point> | undefined,
): feature is StationFeature => StationFeatureSchema.safeParse(feature).success;

export const isBikeStationFeature = (
  feature: Feature<Point> | undefined,
): feature is StationFeature & {
  properties: {vehicle_type_form_factor: FormFactor.Bicycle};
} =>
  isStationFeature(feature) &&
  feature.properties?.vehicle_type_form_factor === FormFactor.Bicycle;

export const isCarStationFeature = (
  feature: Feature<Point> | undefined,
): feature is StationFeature & {
  properties: {vehicle_type_form_factor: FormFactor.Car};
} =>
  isStationFeature(feature) &&
  feature.properties?.vehicle_type_form_factor === FormFactor.Car;

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

export const extend = (midpoint: Feature<Point>, range: number) =>
  buffer(midpoint, range, {units: 'meters'});

export const formatRange = (rangeInMeters: number, language: Language) => {
  const rangeInKm =
    rangeInMeters > 5000
      ? (rangeInMeters / 1000).toFixed(0)
      : formatDecimalNumber(rangeInMeters / 1000, language, 1);
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

export const formatPrice = (number: number, language: Language) => {
  return Number.isInteger(number)
    ? number
    : formatDecimalNumber(number, language, 2);
};

export const formatPricePerUnit = (
  pricePlan: PricingPlanFragment,
  language: Language,
) => {
  const perMinPrice = pricePlan.perMinPricing?.[0];
  const perKmPrice = pricePlan.perKmPricing?.[0];

  if (perMinPrice) {
    return {
      price: `${formatPrice(perMinPrice.rate, language)} kr`,
      unit: 'min',
    };
  }
  if (perKmPrice) {
    return {price: `${formatPrice(perKmPrice.rate, language)} kr`, unit: 'km'};
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
