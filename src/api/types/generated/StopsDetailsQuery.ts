import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type StopsDetailsQuery = {
  stopPlaces: Array<{
    name: string;
    transportMode?: Array<Types.TransportMode>;
    description?: string;
    id: string;
    quays?: Array<{
      id: string;
      description?: string;
      name: string;
      publicCode?: string;
      stopPlace?: {id: string};
    }>;
  }>;
};
