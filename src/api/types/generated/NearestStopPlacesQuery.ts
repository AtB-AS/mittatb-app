import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

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
              }>;
            }
          | {};
      };
    }>;
  };
};
