import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean'];
  when?: Types.Maybe<Types.Scalars['DateTime']>;
  cursor?: Types.Maybe<Types.Scalars['String']>;
  transferPenalty?: Types.Maybe<Types.Scalars['Int']>;
  waitReluctance?: Types.Maybe<Types.Scalars['Float']>;
  walkReluctance?: Types.Maybe<Types.Scalars['Float']>;
  walkSpeed?: Types.Maybe<Types.Scalars['Float']>;
}>;

export type TripsQuery = {
  trip: {
    nextPageCursor?: string;
    previousPageCursor?: string;
    metadata?: {
      nextDateTime?: any;
      prevDateTime?: any;
      searchWindowUsed: number;
    };
    tripPatterns: Array<{
      expectedStartTime?: any;
      expectedEndTime?: any;
      duration?: any;
      walkDistance?: number;
      legs: Array<{
        mode?: Types.Mode;
        distance?: number;
        duration?: any;
        aimedStartTime?: any;
        aimedEndTime?: any;
        expectedEndTime?: any;
        expectedStartTime?: any;
        realtime?: boolean;
        transportSubmode?: Types.TransportSubmode;
        line?: {
          id: string;
          name?: string;
          transportSubmode?: Types.TransportSubmode;
          publicCode?: string;
        };
        fromEstimatedCall?: {
          aimedDepartureTime?: any;
          expectedDepartureTime?: any;
          destinationDisplay?: {frontText?: string};
          quay?: {publicCode?: string; name: string};
          notices: Array<{text?: string; id: string}>;
        };
        situations: Array<{
          situationNumber?: string;
          description: Array<{value?: string}>;
        }>;
        fromPlace: {
          name?: string;
          longitude: number;
          latitude: number;
          quay?: {
            id: string;
            publicCode?: string;
            name: string;
            longitude?: number;
            latitude?: number;
            stopPlace?: {longitude?: number; latitude?: number; name: string};
          };
        };
        toPlace: {
          name?: string;
          longitude: number;
          latitude: number;
          quay?: {
            id: string;
            publicCode?: string;
            name: string;
            longitude?: number;
            latitude?: number;
            stopPlace?: {longitude?: number; latitude?: number; name: string};
          };
        };
        serviceJourney?: {id: string};
        interchangeTo?: {guaranteed?: boolean; ToServiceJourney?: {id: string}};
        pointsOnLink?: {points?: string; length?: number};
        intermediateEstimatedCalls: Array<{quay?: {name: string; id: string}}>;
        authority?: {id: string};
      }>;
    }>;
  };
};
