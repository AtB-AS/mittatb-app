import type {UserProfile} from '@atb-as/config-specs';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';
import type {TicketOffer} from '@atb-as/utils';

export type SalesTripPatternLeg = {
  expectedStartTime: string;
  expectedEndTime: string;
  fromStopPlaceId: string;
  fromStopPlaceName?: string;
  toStopPlaceId: string;
  toStopPlaceName?: string;
  serviceJourneyId: string;
  mode: string;
  subMode?: TransportSubmode;
  lineNumber?: string;
  lineName?: string;
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
