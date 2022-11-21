import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type QuayDeparturesQuery = {
  quay?: {
    id: string;
    description?: string;
    publicCode?: string;
    name: string;
    estimatedCalls: Array<{
      date?: any;
      expectedDepartureTime: any;
      aimedDepartureTime: any;
      realtime: boolean;
      cancellation: boolean;
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
    situations: Array<{
      id: string;
      situationNumber?: string;
      reportType?: Types.ReportType;
      summary: Array<{language?: string; value: string}>;
      description: Array<{language?: string; value: string}>;
    }>;
  };
};
