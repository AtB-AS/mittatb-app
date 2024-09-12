import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct, TariffZone} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {TicketRecipientType} from '@atb/stacks-hierarchy/types.ts';

export type Root_PurchaseConfirmationScreenParams = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  fromPlace: TariffZone | StopPlaceFragment;
  toPlace: TariffZone | StopPlaceFragment;
  userProfilesWithCount: UserProfileWithCount[];
  travelDate?: string;
  mode?: 'TravelSearch' | 'Ticket';
  recipient?: TicketRecipientType;
};
