import {
  PricingPlanFragment,
  RentalUrisFragment,
  SystemFragment,
  TranslatedStringFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';
import * as Types from '../mobility-types_v2';

export type VehicleTypeAvailabilityBasicFragment = {
  count: number;
  vehicleType: {formFactor: Types.FormFactor, propulsionType: Types.PropulsionType};
};

export type StationBasicFragment = {
  id: string;
  lat: number;
  lon: number;
  capacity: number;
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
  id: string;
  formFactor: Types.FormFactor;
  propulsionType: Types.PropulsionType;
  maxRangeMeters?: number;
  riderCapacity?: number;
  make?: string;
  model?: string;
  vehicleAccessories?: Array<Types.VehicleAccessory>;
  vehicleImage?: string;
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
