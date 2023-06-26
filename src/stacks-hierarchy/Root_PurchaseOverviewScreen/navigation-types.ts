import {FareProductTypeConfig} from '@atb/configuration';
import {BoatStopPoint, PreassignedFareProduct} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';

export type Root_PurchaseOverviewScreenParams = {
  refreshOffer?: boolean;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct?: PreassignedFareProduct;
  userProfilesWithCount?: UserProfileWithCount[];
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  fromBoatStopPoint?: BoatStopPoint;
  toBoatStopPoint?: BoatStopPoint;
  mode?: 'Ticket' | 'TravelSearch';
  travelDate?: string;
};
