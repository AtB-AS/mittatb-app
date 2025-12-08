import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';

// copied from https://github.com/AtB-AS/atb-bff/blob/main/src/service/impl/departures/journey-gql/stops-nearest.graphql-gen.ts#L7-L13
export type NearestStopPlacesQueryVariables = {
  count?: number;
  distance: number;
  longitude: number;
  latitude: number;
  after?: string;
};

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
