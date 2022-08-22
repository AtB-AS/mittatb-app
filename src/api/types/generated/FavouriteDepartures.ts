import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type FavouriteDepartureQueryVariables = Types.Exact<{
  quayIds?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['String']>>
    | Types.InputMaybe<Types.Scalars['String']>
  >;
  lines?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['ID']>>
    | Types.InputMaybe<Types.Scalars['ID']>
  >;
}>;

export type FavouriteDepartureQuery = {
  quays: Array<{
    id: string;
    name: string;
    estimatedCalls: Array<{
      aimedDepartureTime: any;
      serviceJourney?: {line: {id: string}};
      destinationDisplay?: {frontText?: string};
    }>;
  }>;
};
