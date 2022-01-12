import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  when?: Types.Maybe<Types.Scalars['DateTime']>;
}>;

export type TripsQuery = {
  trip?: Types.Maybe<{
    metadata?: Types.Maybe<{
      nextDateTime?: Types.Maybe<any>;
      prevDateTime?: Types.Maybe<any>;
      searchWindowUsed: number;
    }>;
    tripPatterns: Array<
      Types.Maybe<{
        expectedStartTime?: Types.Maybe<any>;
        expectedEndTime?: Types.Maybe<any>;
        duration?: Types.Maybe<any>;
        walkDistance?: Types.Maybe<number>;
        legs: Array<
          Types.Maybe<{
            mode?: Types.Maybe<Types.Mode>;
            distance?: Types.Maybe<number>;
            duration?: Types.Maybe<any>;
            aimedStartTime?: Types.Maybe<any>;
            aimedEndTime?: Types.Maybe<any>;
            expectedEndTime?: Types.Maybe<any>;
            expectedStartTime?: Types.Maybe<any>;
            realtime?: Types.Maybe<boolean>;
            transportSubmode?: Types.Maybe<Types.TransportSubmode>;
            line?: Types.Maybe<{
              id: string;
              name?: Types.Maybe<string>;
              transportSubmode?: Types.Maybe<Types.TransportSubmode>;
              publicCode?: Types.Maybe<string>;
            }>;
            fromEstimatedCall?: Types.Maybe<{
              aimedDepartureTime?: Types.Maybe<any>;
              expectedDepartureTime?: Types.Maybe<any>;
              destinationDisplay?: Types.Maybe<{
                frontText?: Types.Maybe<string>;
              }>;
              quay?: Types.Maybe<{
                publicCode?: Types.Maybe<string>;
                name: string;
              }>;
              notices: Array<
                Types.Maybe<{text?: Types.Maybe<string>; id: string}>
              >;
            }>;
            situations: Array<
              Types.Maybe<{
                situationNumber?: Types.Maybe<string>;
                description: Array<{value?: Types.Maybe<string>}>;
              }>
            >;
            fromPlace: {
              name?: Types.Maybe<string>;
              longitude: number;
              latitude: number;
              quay?: Types.Maybe<{
                id: string;
                publicCode?: Types.Maybe<string>;
                name: string;
                longitude?: Types.Maybe<number>;
                latitude?: Types.Maybe<number>;
                stopPlace?: Types.Maybe<{
                  longitude?: Types.Maybe<number>;
                  latitude?: Types.Maybe<number>;
                  name: string;
                }>;
              }>;
            };
            toPlace: {
              name?: Types.Maybe<string>;
              longitude: number;
              latitude: number;
              quay?: Types.Maybe<{
                id: string;
                publicCode?: Types.Maybe<string>;
                name: string;
                longitude?: Types.Maybe<number>;
                latitude?: Types.Maybe<number>;
                stopPlace?: Types.Maybe<{
                  longitude?: Types.Maybe<number>;
                  latitude?: Types.Maybe<number>;
                  name: string;
                }>;
              }>;
            };
            serviceJourney?: Types.Maybe<{id: string}>;
            interchangeTo?: Types.Maybe<{
              guaranteed?: Types.Maybe<boolean>;
              ToServiceJourney?: Types.Maybe<{id: string}>;
            }>;
            pointsOnLink?: Types.Maybe<{
              points?: Types.Maybe<string>;
              length?: Types.Maybe<number>;
            }>;
            intermediateEstimatedCalls: Array<
              Types.Maybe<{quay?: Types.Maybe<{name: string; id: string}>}>
            >;
            authority?: Types.Maybe<{id: string}>;
          }>
        >;
      }>
    >;
  }>;
};
