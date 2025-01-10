import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';

export type StopsDetailsQuery = {
  stopPlaces: Array<{
    name: string;
    transportMode?: Array<Types.TransportMode>;
    description?: string;
    id: string;
    latitude?: number;
    longitude?: number;
    quays?: Array<{
      id: string;
      description?: string;
      name: string;
      publicCode?: string;
      stopPlace?: {id: string};
      situations: Array<SituationFragment>;
    }>;
  }>;
};
