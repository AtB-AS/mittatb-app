import {LegMode, TransportMode, TransportSubmode} from '@atb/sdk';
import {
  Mode as Mode_v2,
  TransportMode as TransportMode_v2,
  TransportSubmode as TransportSubMode_v2,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export type AnyMode =
  | LegMode
  | Mode_v2
  | TransportMode
  | TransportMode_v2
  | FormFactor;
export type AnySubMode = TransportSubmode | TransportSubMode_v2;
