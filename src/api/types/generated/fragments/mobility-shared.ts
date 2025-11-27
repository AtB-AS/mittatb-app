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
  id: string;
  operator: OperatorFragment;
  name: TranslatedStringFragment;
  brandAssets?: BrandAssetsFragment;
  rentalApps?: RentalAppsFragment;
  openingHours?: string;
};

export type VehicleTypeBasicFragment = {
  maxRangeMeters?: number;
  formFactor: Types.FormFactor;
};

export type VehicleTypeFragment = {
  id: string;
  propulsionType: Types.PropulsionType;
  name?: TranslatedStringFragment;
} & VehicleTypeBasicFragment;

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
