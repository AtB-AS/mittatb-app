import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type NearestStopPlacesQuery = {
  nearest?: Types.Maybe<{
    pageInfo: {endCursor?: Types.Maybe<string>; hasNextPage: boolean};
    edges?: Types.Maybe<
      Array<
        Types.Maybe<{
          node?: Types.Maybe<{
            distance?: Types.Maybe<number>;
            place?: Types.Maybe<{
              name: string;
              transportMode?: Types.Maybe<
                Array<Types.Maybe<Types.TransportMode>>
              >;
              description?: Types.Maybe<string>;
              id: string;
              quays?: Types.Maybe<
                Array<
                  Types.Maybe<{
                    id: string;
                    description?: Types.Maybe<string>;
                    name: string;
                    publicCode?: Types.Maybe<string>;
                    stopPlace?: Types.Maybe<{id: string}>;
                  }>
                >
              >;
            }>;
          }>;
        }>
      >
    >;
  }>;
};
