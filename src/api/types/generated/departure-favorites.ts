import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type GroupsByIdQuery = {
  stopPlaces: Array<{
    id: string;
    description?: string;
    name: string;
    latitude?: number;
    longitude?: number;
    quays?: Array<{
      id: string;
      name: string;
      description?: string;
      publicCode?: string;
      latitude?: number;
      longitude?: number;
      times: Array<{
        date?: any;
        expectedDepartureTime: any;
        aimedDepartureTime: any;
        predictionInaccurate: boolean;
        realtime: boolean;
        destinationDisplay?: {frontText?: string};
        notices: Array<{text?: string}>;
        situations: Array<{
          id: string;
          situationNumber?: string;
          reportType?: Types.ReportType;
          summary: Array<{language?: string; value: string}>;
          description: Array<{language?: string; value: string}>;
        }>;
        serviceJourney?: {id: string; line: {id: string}};
      }>;
      estimatedCalls: Array<{
        destinationDisplay?: {frontText?: string};
        notices: Array<{text?: string}>;
        serviceJourney?: {
          id: string;
          directionType?: Types.DirectionType;
          privateCode?: string;
          transportSubmode?: Types.TransportSubmode;
          line: {
            description?: string;
            flexibleLineType?: string;
            id: string;
            name?: string;
            transportMode?: Types.TransportMode;
            transportSubmode?: Types.TransportSubmode;
            publicCode?: string;
            notices: Array<{text?: string}>;
            situations: Array<{
              id: string;
              situationNumber?: string;
              reportType?: Types.ReportType;
              summary: Array<{language?: string; value: string}>;
              description: Array<{language?: string; value: string}>;
            }>;
          };
          journeyPattern?: {notices: Array<{text?: string}>};
          notices: Array<{text?: string}>;
        };
      }>;
      situations: Array<{
        id: string;
        situationNumber?: string;
        reportType?: Types.ReportType;
        summary: Array<{language?: string; value: string}>;
        description: Array<{language?: string; value: string}>;
      }>;
    }>;
  }>;
};
