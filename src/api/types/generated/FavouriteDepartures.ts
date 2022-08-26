import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {
  Notice,
  PtSituationElement,
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

export type FavouriteDepartureQueryVariables = Types.Exact<{
  quayIds?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['String']>>
    | Types.InputMaybe<Types.Scalars['String']>
  >;
  lines?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.Scalars['ID']>>
    | Types.InputMaybe<Types.Scalars['ID']>
  >;
}>;

export type FavouriteDepartureQuery = {
  quays: Array<{
    id: string;
    name: string;
    stopPlace?: {
      id: string;
      description?: string;
      name: string;
      longitude?: number;
      latitude?: number;
    };
    estimatedCalls: Array<{
      date?: any;
      expectedDepartureTime: any;
      aimedDepartureTime: any;
      quay?: {id: string};
      destinationDisplay?: {frontText?: string};
      serviceJourney?: {
        id: string;
        line: {
          id: string;
          publicCode?: string;
          transportMode?: Types.TransportMode;
          transportSubmode?: Types.TransportSubmode;
          name?: string;
        };
      };
    }>;
  }>;
};


