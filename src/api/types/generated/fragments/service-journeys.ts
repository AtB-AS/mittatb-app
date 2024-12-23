import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import type {LineFragment} from '@atb/api/types/generated/fragments/lines';

export type ServiceJourneyWithEstCallsFragment = {
  id: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
  publicCode?: string;
  line: LineFragment;
  journeyPattern?: {notices: Array<NoticeFragment>};
  notices: Array<NoticeFragment>;
  estimatedCalls?: Array<EstimatedCallWithQuayFragment>;
};
