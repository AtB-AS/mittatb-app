import * as Types from '../mobility-types_v2';
import {
  PricingPlanFragment,
  RentalUrisFragment,
  SystemFragment,
  TranslatedStringFragment,
} from './mobility-shared';

export type VehicleRangeFragment = {maxRangeMeters?: number};

export type VehicleTypeFragment = {
  id: string;
  formFactor: Types.FormFactor;
  name?: TranslatedStringFragment;
} & VehicleRangeFragment;

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
