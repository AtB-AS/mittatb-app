import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StopPlace} from '@atb/api/types/stopPlaces';

export type Root_PurchaseOverviewScreenParams = {
  refreshOffer?: boolean;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct?: PreassignedFareProduct;
  userProfilesWithCount?: UserProfileWithCount[];
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  fromHarbor?: StopPlace;
  toHarbor?: StopPlace;
  mode?: 'Ticket' | 'TravelSearch';
  travelDate?: string;
  onFocusElement?: string;
};
