import {Situation as Situation_v1} from '@atb/sdk';
import {Situation as Situation_from_Trips} from '@atb/api/types/trips';

export type SituationType = Situation_v1 | Situation_from_Trips;

export type SituationsType = Situation_v1[] | Situation_from_Trips[];
