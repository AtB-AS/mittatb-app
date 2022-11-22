import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

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
      situations: Array<{
        id: string;
        situationNumber?: string;
        reportType?: Types.ReportType;
        summary: Array<{language?: string; value: string}>;
        description: Array<{language?: string; value: string}>;
      }>;
    }>;
  }>;
};
