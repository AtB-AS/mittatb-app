import type {UserProfile} from '@atb-as/config-specs';
import type {Offer} from '@atb/modules/ticketing';
import {TransportSubmode} from '@atb/api/types/generated/journey_planner_v3_types';

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
};

export type Traveller = {
  id: string;
  userType: UserProfile['userTypeString'];
};

export type OfferFromLegsResponse = {
  offers: (Offer & {available: number | undefined})[];
  cheapestTotalPrice: number;
};
