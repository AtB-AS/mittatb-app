import {
  PricingPlanFragment,
  RentalUrisFragment,
  SystemFragment,
  VehicleTypeBasicFragment,
  VehicleTypeFragment,
} from './mobility-shared';

export type VehicleBasicFragment = {
  id: string;
  lat: number;
  lon: number;
  currentFuelPercent?: number;
  currentRangeMeters: number;
  vehicleType: VehicleTypeBasicFragment;
};

export type VehicleExtendedFragment = {
  isReserved: boolean;
  isDisabled: boolean;
  availableUntil?: string;
  pricingPlan: PricingPlanFragment;
  system: SystemFragment;
  rentalUris?: RentalUrisFragment;
  vehicleType: VehicleTypeFragment;
} & VehicleBasicFragment;

export type VehicleId = string;
