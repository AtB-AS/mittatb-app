import {FareProductTypeConfig} from '@atb/configuration';
import {BoatStopPoint, PreassignedFareProduct} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';

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
