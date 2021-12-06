import * as Types from './generated/TripsQuery';
import {TripsQueryVariables} from './generated/TripsQuery';
import {Coordinates} from '@entur/sdk';
import {MapLeg} from '@atb/sdk';

export type TripsQuery = Types.TripsQuery;
export type Trip = Types.TripsQuery['trip'];
export type TripPattern = Required<Types.TripsQuery>['trip']['tripPatterns'][0] & {
  id?: any;
};
export type TripMetadata = Required<Types.TripsQuery>['trip']['metadata'];
export type Leg = Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0];
export type Situation = Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0]['situations'][0];
export type Quay = Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0]['fromPlace']['quay'];

export type

export type TripsQueryWithJourneyIds = {
  query: TripsQueryVariables;
  journeyIds: string[];
};

function test(trip: TripPattern) {
  console.log(trip.expectedStartTime);
  console.log(trip.id);
}
