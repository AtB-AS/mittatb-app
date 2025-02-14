import {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import {PtSituationElement} from '@atb/api/types/generated/journey_planner_v3_types';

export type SituationType = PtSituationElement | SituationFragment;
