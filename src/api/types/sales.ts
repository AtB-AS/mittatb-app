import type {UserProfile} from '@atb-as/config-specs';
import type {TicketOffer} from '@atb-as/utils';

export type SalesTripPatternLeg = {
  expectedStartTime: string;
  fromStopPlaceId: string;
  toStopPlaceId: string;
  serviceJourneyId: string;
  mode: string;
};

export type Traveller = {
  id: string;
  userType: UserProfile['userTypeString'];
};

export type OfferFromLegsResponse = {
  offers: (TicketOffer & {available: number | undefined})[];
  cheapestTotalPrice: number;
};
