import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {TripFragment} from './fragments/trips';

export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean']['input'];
  when?: Types.Maybe<Types.Scalars['DateTime']['input']>;
  cursor?: Types.Maybe<Types.Scalars['String']['input']>;
  transferSlack?: Types.Maybe<Types.Scalars['Int']['input']>;
  transferPenalty?: Types.Maybe<Types.Scalars['Int']['input']>;
  waitReluctance?: Types.Maybe<Types.Scalars['Float']['input']>;
  walkReluctance?: Types.Maybe<Types.Scalars['Float']['input']>;
  walkSpeed?: Types.Maybe<Types.Scalars['Float']['input']>;
  modes?: Types.Modes;
}>;

export type TripsQuery = {
  trip: TripFragment;
};

export type NonTransitTripsQueryVariables = Omit<
  TripsQueryVariables,
  | 'cursor'
  | 'transferPenalty'
  | 'waitReluctance'
  | 'walkReluctance'
  | 'numTripPatterns'
  | 'modes'
> & {
  directModes: StreetMode[];
};
