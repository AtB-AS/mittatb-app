import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type SituationFragment = {
  id: string;
  situationNumber?: string;
  reportType?: Types.ReportType;
  summary: Array<{language?: string; value: string}>;
  description: Array<{language?: string; value: string}>;
};
