import * as Types from '../mobility-types_v2';
import {
  PricingPlanFragment,
  RentalUrisFragment,
  SystemFragment,
  TranslatedStringFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';

export type VehicleTypeAvailabilityBasicFragment = {
  count: number;
  vehicleType: {formFactor: Types.FormFactor};
};

export type StationBasicFragment = {
  id: string;
  lat: number;
  lon: number;
  vehicleTypesAvailable?: Array<VehicleTypeAvailabilityBasicFragment>;
};

export type BikeStationFragment = {
  numDocksAvailable?: number;
  name: TranslatedStringFragment;
  pricingPlans: Array<PricingPlanFragment>;
  system: SystemFragment;
  rentalUris?: RentalUrisFragment;
} & StationBasicFragment;

export type CarVehicleTypeFragment = {
  formFactor: Types.FormFactor;
  propulsionType: Types.PropulsionType;
  maxRangeMeters?: number;
  riderCapacity?: number;
  make?: string;
  model?: string;
  vehicleAccessories?: Array<Types.VehicleAccessory>;
  name?: TranslatedStringFragment;
};

export type CarAvailabilityFragment = {
  count: number;
  vehicleType: CarVehicleTypeFragment;
};

export type CarStationFragment = {
  name: TranslatedStringFragment;
  pricingPlans: Array<PricingPlanFragment>;
  system: SystemFragment;
  rentalUris?: RentalUrisFragment;
  vehicleTypesAvailable?: Array<CarAvailabilityFragment>;
} & StationBasicFragment;
