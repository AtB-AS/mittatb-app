import * as Types from './generated/TripsQuery';
import {
  BookingAvailabilityType,
  type TicketOffer,
  type TransferRisk,
} from '@atb-as/utils';
import type {BookingDisabledReason} from '@atb/modules/booking';

export type TripsQuery = Types.TripsQuery;
export type Trip = Types.TripsQuery['trip'];
/**
 * Data freshness only. `'impossible'` is still sent by the BFF but no longer
 * read here — transfer risk moved to `transferRisk`. Both drop it once the
 * minimum supported version reads that field.
 */
export type TripPatternStatus = 'valid' | 'impossible' | 'stale';
export type TripPattern =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0] & {
    compressedQuery?: string;
    status?: TripPatternStatus;
    /** Worst transfer risk across the legs, computed by the BFF. */
    transferRisk?: TransferRisk;
    aimedStartTime?: string;
    aimedEndTime?: string;
  };
export type TripMetadata = Required<Types.TripsQuery>['trip']['metadata'];
export type Leg =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0] & {
    isStale?: boolean;
    /** Set by the BFF on the transit leg you are at risk of missing. */
    transferRisk?: TransferRisk;
  };
export type Line = Required<
  Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0]
>['line'];

export type ServiceJourneyEstimatedCall =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0]['serviceJourneyEstimatedCalls'][0];
export type Place =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0]['fromPlace'];

export type Quay = Place['quay'];
export type StopPlace = Required<Required<Place>['quay']>['stopPlace'];

export type BookingAvailabilityQueryVariables = {
  searchTime: string;
  fromStopPlaceId: string;
  toStopPlaceId: string;
  travellers: {id: string; userType: string}[];
  products: string[];
  supplementProducts?: string[];
};

export type TripPatternWithBooking = TripPattern & {
  booking: {
    availability: BookingAvailabilityType;
    offer: TicketOffer;
    disabledReason?: BookingDisabledReason;
  };
};

export type BookingTripsResult = {
  trip: {
    tripPatterns: TripPatternWithBooking[];
  };
};
