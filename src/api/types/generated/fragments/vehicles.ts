import * as Types from '../mobility-types_v2';
import {
  PricingPlanFragment,
  RentalUrisFragment,
  SystemFragment,
  TranslatedStringFragment,
} from './mobility-shared';

export type VehicleTypeFragment = {
  id: string;
  formFactor: Types.FormFactor;
  maxRangeMeters?: number;
  name?: TranslatedStringFragment;
};

export type VehicleFragment = {
  id: string;
  lat: number;
  lon: number;
  isReserved: boolean;
  isDisabled: boolean;
  currentRangeMeters: number;
  currentFuelPercent?: number;
  availableUntil?: string;
  vehicleType: VehicleTypeFragment;
  pricingPlan: PricingPlanFragment;
  system: SystemFragment;
  rentalUris?: RentalUrisFragment;
};
