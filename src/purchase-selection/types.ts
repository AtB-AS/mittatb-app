import {
  FareProductTypeConfig,
  PreassignedFareProduct,
  UserProfile,
  TariffZone,
} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StopPlaceFragmentWithIsFree} from '@atb/harbors/types.ts';

export type PurchaseSelectionType = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  userProfilesWithCount: UserProfileWithCount[];
  fromPlace: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree;
  toPlace: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree;
  travelDate?: string;
};

export type PurchaseSelectionBuilderInput = {
  userProfiles: UserProfile[];
  preassignedFareProducts: PreassignedFareProduct[];
  tariffZones: TariffZone[];
};

export type PurchaseSelectionEmptyBuilder = {
  forType: (t: string) => PurchaseSelectionBuilder;
};

export type PurchaseSelectionBuilder = {
  product: (p?: PreassignedFareProduct) => PurchaseSelectionBuilder;
  from: (
    f?: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree,
  ) => PurchaseSelectionBuilder;
  to: (
    t?: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree,
  ) => PurchaseSelectionBuilder;
  userProfiles: (u?: UserProfileWithCount[]) => PurchaseSelectionBuilder;
  date: (d?: string) => PurchaseSelectionBuilder;
  build: () => PurchaseSelectionType;
};
