import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';

export type Root_PurchaseOverviewScreenParams = {
  refreshOffer?: boolean;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct?: PreassignedFareProduct;
  userProfilesWithCount?: UserProfileWithCount[];
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  mode?: 'Ticket' | 'TravelSearch';
  travelDate?: string;
};
