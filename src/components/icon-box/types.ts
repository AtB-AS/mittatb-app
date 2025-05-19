import {
  TransportModeType,
  TransportSubmodeType,
} from '@atb/modules/configuration';
import {Mode as Mode_v2} from '@atb/api/types/generated/journey_planner_v3_types';

export type AnyMode = Mode_v2 | TransportModeType;
export type AnySubMode = TransportSubmodeType;
