import type {UserProfile} from '@atb-as/config-specs';
import type {Offer} from '@atb/modules/ticketing';

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
  offers: (Offer & {available: number | undefined})[];
  cheapestTotalPrice: number;
};
