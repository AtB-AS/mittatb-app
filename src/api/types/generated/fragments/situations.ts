import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {
  InfoLinkFragment,
  MultilingualStringFragment,
  ValidityPeriodFragment,
} from '@atb/api/types/generated/fragments/shared';

export type SituationFragment = {
  id: string;
  situationNumber?: string;
  reportType?: Types.ReportType;
  summary: Array<MultilingualStringFragment>;
  description: Array<MultilingualStringFragment>;
  advice: Array<MultilingualStringFragment>;
  infoLinks?: Array<InfoLinkFragment>;
  validityPeriod?: ValidityPeriodFragment;
};
