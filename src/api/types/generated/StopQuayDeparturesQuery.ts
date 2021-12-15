import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type StopPlaceQuayDeparturesQuery = {
  stopPlace?: Types.Maybe<{
    id: string;
    quays?: Types.Maybe<
      Array<
        Types.Maybe<{
          id: string;
          estimatedCalls: Array<
            Types.Maybe<{
              aimedDepartureTime?: Types.Maybe<any>;
              expectedDepartureTime?: Types.Maybe<any>;
              realtime?: Types.Maybe<boolean>;
              realtimeState?: Types.Maybe<Types.RealtimeState>;
              quay?: Types.Maybe<{
                id: string;
                stopPlace?: Types.Maybe<{id: string}>;
              }>;
              destinationDisplay?: Types.Maybe<{
                frontText?: Types.Maybe<string>;
              }>;
              serviceJourney?: Types.Maybe<{
                id: string;
                privateCode?: Types.Maybe<string>;
                transportMode?: Types.Maybe<Types.TransportMode>;
                transportSubmode?: Types.Maybe<Types.TransportSubmode>;
                line: {
                  name?: Types.Maybe<string>;
                  id: string;
                  description?: Types.Maybe<string>;
                  publicCode?: Types.Maybe<string>;
                  transportMode?: Types.Maybe<Types.TransportMode>;
                  transportSubmode?: Types.Maybe<Types.TransportSubmode>;
                };
              }>;
            }>
          >;
        }>
      >
    >;
  }>;
};
