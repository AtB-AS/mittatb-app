import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type StopPlaceQuayDeparturesQuery = {
  stopPlace?: Types.Maybe<{
    id: string;
    quays?: Types.Maybe<
      Array<
        Types.Maybe<{
          id: string;
          estimatedCalls: Array<{
            expectedDepartureTime?: Types.Maybe<any>;
            realtime?: Types.Maybe<boolean>;
            quay?: Types.Maybe<{id: string}>;
            destinationDisplay?: Types.Maybe<{frontText?: Types.Maybe<string>}>;
            serviceJourney?: Types.Maybe<{
              id: string;
              line: {
                id: string;
                description?: Types.Maybe<string>;
                publicCode?: Types.Maybe<string>;
                transportMode?: Types.Maybe<Types.TransportMode>;
                transportSubmode?: Types.Maybe<Types.TransportSubmode>;
              };
            }>;
          }>;
        }>
      >
    >;
  }>;
};
