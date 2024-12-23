import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {AuthorityFragment} from '@atb/api/types/generated/fragments/authority';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';

export type LineFragment = {
  id: string;
  publicCode?: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
  flexibleLineType?: string;
  authority?: AuthorityFragment;
  notices: Array<NoticeFragment>;
};
