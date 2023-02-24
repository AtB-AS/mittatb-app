import * as Types from '../mobility-types_v2';
import {
  OperatorFragment,
  PricingPlanFragment,
  TranslatedStringFragment,
} from './mobility-shared';

export type RentalUrisFragment = {android?: string; ios?: string};

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
  system: {operator: OperatorFragment; name: TranslatedStringFragment};
  rentalUris?: RentalUrisFragment;
};

export type VehicleTypeFragment = {
  id: string;
  formFactor: Types.FormFactor;
  maxRangeMeters?: number;
  name?: TranslatedStringFragment;
};
