import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';

export type NearestStopPlacesQueryVariables = Types.Exact<{
  count?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  distance: Types.Scalars['Float']['input'];
  longitude: Types.Scalars['Float']['input'];
  latitude: Types.Scalars['Float']['input'];
  after?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type NearestStopPlacesQuery = {
  nearest?: {
    pageInfo: {endCursor?: string; hasNextPage: boolean};
    edges?: Array<{
      node?: {
        distance?: number;
        place?:
          | {
              name: string;
              transportMode?: Array<Types.TransportMode>;
              description?: string;
              id: string;
              quays?: Array<{
                id: string;
                description?: string;
                name: string;
                publicCode?: string;
                stopPlace?: {id: string};
                situations: Array<SituationFragment>;
              }>;
            }
          | {};
      };
    }>;
  };
};
