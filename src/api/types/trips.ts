import * as Types from './generated/TripsQuery';
import {TripsQueryVariables} from './generated/TripsQuery';

export type TripsQuery = Types.TripsQuery;
export type Trip = Types.TripsQuery['trip'];
export type TripPattern =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0] & {
    compressedQuery?: any;
  };
export type TripMetadata = Required<Types.TripsQuery>['trip']['metadata'];
export type Leg =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0];
export type Place =
  Required<Types.TripsQuery>['trip']['tripPatterns'][0]['legs'][0]['fromPlace'];

export type Quay = Place['quay'];
export type StopPlace = Required<Required<Place>['quay']>['stopPlace'];

export type TripsQueryWithJourneyIds = {
  query: TripsQueryVariables;
  journeyIds: string[];
};
