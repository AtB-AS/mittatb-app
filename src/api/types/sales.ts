import type {UserProfile} from '@atb-as/config-specs';
import type {TicketOffer} from '@atb-as/utils';

export type OfferSearchLeg = {
  fromStopPlaceId: string;
  toStopPlaceId: string;
  serviceJourneyId: string;
  mode: string;
  travelDate: string;
};

export type Traveller = {
  id: string;
  userType: UserProfile['userTypeString'];
  productIds?: string[];
};

export type OfferFromLegsResponse = {
  offers: (TicketOffer & {available: number | undefined})[];
  cheapestTotalPrice: number;
};
