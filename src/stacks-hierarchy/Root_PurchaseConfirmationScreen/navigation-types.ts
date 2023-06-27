import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct, TariffZone} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {LeftButtonProps} from '@atb/components/screen-header';

export type Root_PurchaseConfirmationScreenParams = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone: TariffZone;
  toTariffZone: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  travelDate?: string;
  headerLeftButton: LeftButtonProps;
  mode?: 'TravelSearch' | 'Ticket';
};
