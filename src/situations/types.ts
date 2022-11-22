import {Situation as Situation_v1} from '@atb/sdk';
import {SituationFragment} from '@atb/api/types/generated/fragments/situations';

export type SituationType = Situation_v1 | SituationFragment;

export type SituationsType = Situation_v1[] | SituationFragment[];
