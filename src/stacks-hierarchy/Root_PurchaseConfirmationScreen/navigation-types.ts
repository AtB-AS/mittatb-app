import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct, TariffZone} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {LeftButtonProps} from '@atb/components/screen-header';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

export type Root_PurchaseConfirmationScreenParams = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  fromPlace: TariffZone | StopPlaceFragment;
  toPlace: TariffZone | StopPlaceFragment;
  userProfilesWithCount: UserProfileWithCount[];
  travelDate?: string;
  headerLeftButton: LeftButtonProps;
  mode?: 'TravelSearch' | 'Ticket';
};
