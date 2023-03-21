import {
  PricingPlanFragment,
  RentalUrisFragment,
  SystemFragment,
  TranslatedStringFragment,
} from '@atb/api/types/generated/fragments/mobility-shared';

export type StationFragment = {
  id: string;
  lat: number;
  lon: number;
  capacity?: number;
  numBikesAvailable: number;
  numDocksAvailable?: number;
  name: TranslatedStringFragment;
  pricingPlans: Array<PricingPlanFragment>;
  system: SystemFragment;
  rentalUris?: RentalUrisFragment;
};
