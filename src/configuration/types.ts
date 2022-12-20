import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

export type TransportModeType = {
  mode: TransportMode;
  subMode?: TransportSubmode;
};
