import * as Types from './generated/TripsQuery';

export type TripsQuery = Types.TripsQuery;
export type Trip = Types.TripsQuery['trip'];
export type TripPattern = Required<Types.TripsQuery>['trip']['tripPatterns'][0] & {
  id?: any;
};
export type TripMetadata = Required<Types.TripsQuery>['trip']['metadata'];
export type Leg = Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0];

function test(trip: TripPattern) {
  console.log(trip.expectedStartTime);
  console.log(trip.id);
}
