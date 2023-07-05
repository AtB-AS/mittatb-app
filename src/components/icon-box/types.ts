import {TransportModeType, TransportSubmodeType} from '@atb-as/config-specs';
import {
  Mode as Mode_v2,
  StreetMode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {LegMode} from '@atb/sdk';

export type AnyMode =
  | LegMode
  | Mode_v2
  | TransportModeType
  | 'flex'
  | StreetMode;
export type AnySubMode = TransportSubmodeType;
