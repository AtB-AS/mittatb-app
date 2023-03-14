import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type DeparturesQuery = {
  quays: Array<{
    id: string;
    description?: string;
    publicCode?: string;
    name: string;
    estimatedCalls: Array<{
      date: any;
      expectedDepartureTime: any;
      aimedDepartureTime: any;
      realtime: boolean;
      cancellation: boolean;
      quay: {id: string};
      destinationDisplay?: {frontText?: string};
      serviceJourney: {
        id: string;
        line: {
          id: string;
          description?: string;
          publicCode?: string;
          transportMode?: Types.TransportMode;
          transportSubmode?: Types.TransportSubmode;
          notices: Array<{id: string; text?: string}>;
        };
        journeyPattern?: {notices: Array<{id: string; text?: string}>};
        notices: Array<{id: string; text?: string}>;
      };
      situations: Array<{
        id: string;
        situationNumber?: string;
        reportType?: Types.ReportType;
        summary: Array<{language?: string; value: string}>;
        description: Array<{language?: string; value: string}>;
        advice: Array<{language?: string; value: string}>;
        infoLinks?: Array<{uri: string; label?: string}>;
        validityPeriod?: {startTime?: any; endTime?: any};
      }>;
      notices: Array<{id: string; text?: string}>;
    }>;
    situations: Array<{
      id: string;
      situationNumber?: string;
      reportType?: Types.ReportType;
      summary: Array<{language?: string; value: string}>;
      description: Array<{language?: string; value: string}>;
      advice: Array<{language?: string; value: string}>;
      infoLinks?: Array<{uri: string; label?: string}>;
      validityPeriod?: {startTime?: any; endTime?: any};
    }>;
  }>;
};
