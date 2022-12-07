import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type ServiceJourneyWithEstimatedCallsQuery = {
  serviceJourney?: {
    id: string;
    transportMode?: Types.TransportMode;
    transportSubmode?: Types.TransportSubmode;
    publicCode?: string;
    line: {publicCode?: string};
    notices: Array<{text?: string}>;
    estimatedCalls?: Array<{
      actualArrivalTime?: any;
      actualDepartureTime?: any;
      aimedArrivalTime: any;
      aimedDepartureTime: any;
      cancellation: boolean;
      date?: any;
      expectedDepartureTime: any;
      expectedArrivalTime: any;
      forAlighting: boolean;
      forBoarding: boolean;
      realtime: boolean;
      destinationDisplay?: {frontText?: string};
      quay?: {
        id: string;
        name: string;
        publicCode?: string;
        situations: Array<{
          id: string;
          situationNumber?: string;
          reportType?: Types.ReportType;
          summary: Array<{language?: string; value: string}>;
          description: Array<{language?: string; value: string}>;
        }>;
        stopPlace?: {
          id: string;
          name: string;
          latitude?: number;
          longitude?: number;
        };
        tariffZones: Array<{id: string; name?: string}>;
      };
      notices: Array<{text?: string}>;
      situations: Array<{
        id: string;
        situationNumber?: string;
        reportType?: Types.ReportType;
        summary: Array<{language?: string; value: string}>;
        description: Array<{language?: string; value: string}>;
      }>;
    }>;
  };
};
