import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {AuthorityFragment} from '@atb/api/types/generated/fragments/authority';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';

export type ServiceJourneyWithEstCallsFragment = {
  id: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
  publicCode?: string;
  line: {
    publicCode?: string;
    authority?: AuthorityFragment;
    notices: Array<NoticeFragment>;
  };
  journeyPattern?: {notices: Array<NoticeFragment>};
  notices: Array<NoticeFragment>;
  estimatedCalls?: Array<EstimatedCallWithQuayFragment>;
};
