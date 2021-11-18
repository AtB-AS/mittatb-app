import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

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
            line?: Types.Maybe<{
              id: string;
              publicCode?: Types.Maybe<string>;
              name?: Types.Maybe<string>;
            }>;
            fromEstimatedCall?: Types.Maybe<{
              aimedDepartureTime?: Types.Maybe<any>;
              expectedDepartureTime?: Types.Maybe<any>;
            }>;
          }>
        >;
      }>
    >;
  }>;
};
