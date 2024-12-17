import {Feature, Point} from 'geojson';
import {VehicleBasicFragment} from '@atb/api/types/generated/fragments/vehicles';
import {
  PricingPlanFragment,
  RentalUrisFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import {FormFactorFilterType} from '@atb/components/map';
import buffer from '@turf/buffer';
import {Platform} from 'react-native';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {
  StationBasicFragment,
  VehicleTypeAvailabilityBasicFragment,
} from '@atb/api/types/generated/fragments/stations';
import {Language} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {enumFromString} from '@atb/utils/enum-from-string';
import {MobilityOperatorType} from '@atb-as/config-specs/lib/mobility-operators';

export const isScooter = (
  feature: Feature<Point> | undefined,
): feature is Feature<Point, VehicleBasicFragment> =>
  feature?.properties?.vehicle_type_form_factor === FormFactor.Scooter ||
  feature?.properties?.vehicle_type_form_factor === FormFactor.ScooterStanding;

export const isBicycle = (
  feature: Feature<Point> | undefined,
): feature is Feature<Point, VehicleBasicFragment> =>
  feature?.properties?.vehicle_type_form_factor === FormFactor.Bicycle &&
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

export const extend = (midpoint: Feature<Point>, range: number) =>
  buffer(midpoint, range, {units: 'meters'});

export const formatRange = (rangeInMeters: number, language: Language) => {
  const rangeInKm =
    rangeInMeters > 5000
      ? (rangeInMeters / 1000).toFixed(0)
      : formatDecimalNumber(rangeInMeters / 1000, language, 1);
  return `${rangeInKm} km`;
};

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
