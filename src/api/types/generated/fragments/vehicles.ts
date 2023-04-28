import {
  PricingPlanFragment,
  RentalUrisFragment,
  SystemFragment,
  VehicleRangeFragment,
  VehicleTypeFragment,
} from './mobility-shared';

export type VehicleBasicFragment = {
  id: string;
  lat: number;
  lon: number;
  currentFuelPercent?: number;
  currentRangeMeters: number;
  vehicleType: VehicleRangeFragment;
};

export type VehicleExtendedFragment = {
  isReserved: boolean;
  isDisabled: boolean;
  availableUntil?: string;
  vehicleType: VehicleTypeFragment;
  pricingPlan: PricingPlanFragment;
  system: SystemFragment;
  rentalUris?: RentalUrisFragment;
} & VehicleBasicFragment;

export type VehicleId = string;
export type VehicleFragment = Pick<VehicleBasicFragment, 'id' | 'lat' | 'lon'>;
