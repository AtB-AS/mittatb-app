import * as Types from './generated/TripsQuery';
import {BookingAvailabilityType, type TicketOffer} from '@atb-as/utils';

export type TripsQuery = Types.TripsQuery;
export type Trip = Types.TripsQuery['trip'];
export type TripPattern =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0] & {
    compressedQuery?: any;
  };
export type TripMetadata = Required<Types.TripsQuery>['trip']['metadata'];
export type Leg =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0];
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
};

export type TripPatternWithBooking = TripPattern & {
  booking: {
    availability: BookingAvailabilityType;
    offer: TicketOffer;
  };
};

export type BookingTripsResult = {
  trip: {
    tripPatterns: TripPatternWithBooking[];
  };
};
