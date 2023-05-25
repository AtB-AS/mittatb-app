import * as Types from '../mobility-types_v2';

export type OperatorFragment = {id: string; name: TranslatedStringFragment};

export type PricingPlanFragment = {
  price: number;
  perKmPricing?: Array<PricingSegmentFragment>;
  perMinPricing?: Array<PricingSegmentFragment>;
};

export type PricingSegmentFragment = {
  rate: number;
  end?: number;
  interval: number;
  start: number;
};

export type TranslatedStringFragment = {
  translation: Array<TranslationFragment>;
};

export type TranslationFragment = {language: string; value: string};

export type RentalUrisFragment = {android?: string; ios?: string};

export type RentalAppFragment = {discoveryUri?: string; storeUri?: string};

export type RentalAppsFragment = {
  android?: RentalAppFragment;
  ios?: RentalAppFragment;
};

export type BrandAssetsFragment = {
  brandImageUrl: string;
  brandImageUrlDark?: string;
  brandLastModified: string;
};

export type SystemFragment = {
  operator: OperatorFragment;
  name: TranslatedStringFragment;
  brandAssets?: BrandAssetsFragment;
  rentalApps?: RentalAppsFragment;
};

export type VehicleRangeFragment = {maxRangeMeters?: number};

export type VehicleTypeFragment = {
  id: string;
  formFactor: Types.FormFactor;
  name?: TranslatedStringFragment;
} & VehicleRangeFragment;
