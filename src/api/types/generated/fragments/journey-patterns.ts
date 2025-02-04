import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {QuayFragment} from '@atb/api/types/generated/fragments/quays';

export type JourneyPatternsFragment = {
  quays: Array<QuayFragment>;
  line: {
    transportMode?: Types.TransportMode;
    transportSubmode?: Types.TransportSubmode;
    authority?: {id: string};
  };
};
