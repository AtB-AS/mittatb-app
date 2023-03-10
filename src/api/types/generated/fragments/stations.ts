import {
  BrandAssetsFragment,
  OperatorFragment,
  PricingPlanFragment,
  RentalAppsFragment,
  RentalUrisFragment,
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
  system: {
    operator: OperatorFragment;
    name: TranslatedStringFragment;
    brandAssets?: BrandAssetsFragment;
    rentalApps?: RentalAppsFragment;
  };
  rentalUris?: RentalUrisFragment;
};
