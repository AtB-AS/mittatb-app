import * as Types from './journey_planner_v3_types';

export type DatedServiceJourneyQuery = {
  datedServiceJourney?: {
    journeyPattern?: {
      serviceJourneys: Array<{
        id: string;
        transportMode?: Types.TransportMode;
        transportSubmode?: Types.TransportSubmode;
        line: {id: string; publicCode?: string};
        estimatedCalls: Array<{
          expectedArrivalTime: any;
          expectedDepartureTime: any;
          actualArrivalTime?: any;
          actualDepartureTime?: any;
          realtime: boolean;
          quay: {name: string};
          destinationDisplay?: {frontText?: string};
        }>;
      }>;
    };
  };
};
