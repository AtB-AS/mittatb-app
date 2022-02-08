import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type StopPlaceQuayDeparturesQuery = {
  stopPlace?: {
    id: string;
    quays?: Array<{
      id: string;
      estimatedCalls: Array<{
        expectedDepartureTime?: any;
        aimedDepartureTime?: any;
        realtime?: boolean;
        quay?: {id: string};
        destinationDisplay?: {frontText?: string};
        serviceJourney?: {
          id: string;
          line: {
            id: string;
            description?: string;
            publicCode?: string;
            transportMode?: Types.TransportMode;
            transportSubmode?: Types.TransportSubmode;
          };
        };
      }>;
    }>;
  };
};
