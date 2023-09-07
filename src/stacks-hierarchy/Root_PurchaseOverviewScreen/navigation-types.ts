import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StopPlaceFragmentWithIsFree} from '@atb/harbors/types';

export type Root_PurchaseOverviewScreenParams = {
  refreshOffer?: boolean;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct?: PreassignedFareProduct;
  userProfilesWithCount?: UserProfileWithCount[];
  fromPlace?: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree;
  toPlace?: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree;
  mode?: 'Ticket' | 'TravelSearch';
  travelDate?: string;
  onFocusElement?: string;
};
