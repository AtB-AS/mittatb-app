import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type EstimatedCallWithQuayFragment = {
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
    stopPlace?: {
      id: string;
      name: string;
      latitude?: number;
      longitude?: number;
    };
    tariffZones: Array<{id: string; name?: string}>;
  };
  notices: Array<{id: string; text?: string}>;
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
};
