import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type QuayFragment = {
  id: string;
  name: string;
  publicCode?: string;
  stopPlace?: {id: string; name: string; latitude?: number; longitude?: number};
  tariffZones: Array<{id: string; name?: string}>;
};

export type QuayWithSituationsFragment = {
  id: string;
  name: string;
  publicCode?: string;
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
  stopPlace?: {id: string; name: string; latitude?: number; longitude?: number};
  tariffZones: Array<{id: string; name?: string}>;
};
