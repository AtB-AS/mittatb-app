import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';

export type TripsQueryVariables = Types.Exact<{
  from: Types.Location;
  to: Types.Location;
  arriveBy: Types.Scalars['Boolean']['input'];
  when?: Types.Maybe<Types.Scalars['DateTime']['input']>;
  cursor?: Types.Maybe<Types.Scalars['String']['input']>;
  transferSlack?: Types.Maybe<Types.Scalars['Int']['input']>;
  transferPenalty?: Types.Maybe<Types.Scalars['Int']['input']>;
  waitReluctance?: Types.Maybe<Types.Scalars['Float']['input']>;
  walkReluctance?: Types.Maybe<Types.Scalars['Float']['input']>;
  walkSpeed?: Types.Maybe<Types.Scalars['Float']['input']>;
  modes?: Types.Modes;
}>;

export type TripsQuery = {
  trip: TripFragment;
};

export type TripFragment = {
  nextPageCursor?: string;
  previousPageCursor?: string;
  metadata?: {nextDateTime?: any; prevDateTime?: any; searchWindowUsed: number};
  tripPatterns: Array<{
    expectedStartTime: any;
    expectedEndTime: any;
    duration?: any;
    walkDistance?: number;
    legs: Array<{
      mode: Types.Mode;
      distance: number;
      duration: any;
      aimedStartTime: any;
      aimedEndTime: any;
      expectedEndTime: any;
      expectedStartTime: any;
      realtime: boolean;
      transportSubmode?: Types.TransportSubmode;
      rentedBike?: boolean;
      line?: {
        id: string;
        name?: string;
        transportSubmode?: Types.TransportSubmode;
        publicCode?: string;
        flexibleLineType?: string;
        notices: Array<{id: string; text?: string}>;
      };
      fromEstimatedCall?: {
        aimedDepartureTime: any;
        expectedDepartureTime: any;
        stopPositionInPattern: number;
        destinationDisplay?: {frontText?: string; via?: Array<string>};
        quay: {publicCode?: string; name: string};
        notices: Array<{id: string; text?: string}>;
      };
      toEstimatedCall?: {stopPositionInPattern: number};
      situations: Array<{
        id: string;
        situationNumber?: string;
        reportType?: Types.ReportType;
        summary: Array<{language?: string; value: string}>;
        description: Array<{language?: string; value: string}>;
        advice: Array<{language?: string; value: string}>;
        infoLinks?: Array<{uri: string; label?: string}>;
        validityPeriod?: {startTime?: any; endTime?: any};
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
          stopPlace?: {
            id: string;
            longitude?: number;
            latitude?: number;
            name: string;
          };
          situations: Array<{
            id: string;
            situationNumber?: string;
            reportType?: Types.ReportType;
            summary: Array<{language?: string; value: string}>;
            description: Array<{language?: string; value: string}>;
            advice: Array<{language?: string; value: string}>;
            infoLinks?: Array<{uri: string; label?: string}>;
            validityPeriod?: {startTime?: any; endTime?: any};
          }>;
          tariffZones: Array<{id: string; name?: string}>;
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
          stopPlace?: {
            id: string;
            longitude?: number;
            latitude?: number;
            name: string;
          };
          situations: Array<{
            id: string;
            situationNumber?: string;
            reportType?: Types.ReportType;
            summary: Array<{language?: string; value: string}>;
            description: Array<{language?: string; value: string}>;
            advice: Array<{language?: string; value: string}>;
            infoLinks?: Array<{uri: string; label?: string}>;
            validityPeriod?: {startTime?: any; endTime?: any};
          }>;
          tariffZones: Array<{id: string; name?: string}>;
        };
      };
      serviceJourney?: {
        id: string;
        notices: Array<{id: string; text?: string}>;
        journeyPattern?: {notices: Array<{id: string; text?: string}>};
      };
      interchangeTo?: {
        guaranteed?: boolean;
        toServiceJourney?: {id: string};
        maximumWaitTime?: number;
        staySeated?: boolean | undefined;
      };
      pointsOnLink?: {points?: string; length?: number};
      intermediateEstimatedCalls: Array<{
        date: any;
        quay: {name: string; id: string};
      }>;
      authority?: {id: string; name: string; url?: string};
      serviceJourneyEstimatedCalls: Array<{
        actualDepartureTime?: any;
        realtime: boolean;
        aimedDepartureTime: any;
        expectedDepartureTime: any;
        predictionInaccurate: boolean;
        quay: {name: string};
      }>;
      bookingArrangements?: {
        bookingMethods?: Array<Types.BookingMethod>;
        latestBookingTime?: any;
        bookingNote?: string;
        bookWhen?: Types.PurchaseWhen;
        minimumBookingPeriod?: string;
        bookingContact?: {
          contactPerson?: string;
          email?: string;
          url?: string;
          phone?: string;
          furtherDetails?: string;
        };
      };
      datedServiceJourney?: {
        estimatedCalls?: Array<{
          actualDepartureTime?: any;
          predictionInaccurate: boolean;
          quay: {name: string};
        }>;
      };
    }>;
  }>;
};

export type NonTransitTripsQueryVariables = Omit<
  TripsQueryVariables,
  | 'cursor'
  | 'transferPenalty'
  | 'waitReluctance'
  | 'walkReluctance'
  | 'numTripPatterns'
  | 'modes'
> & {
  directModes: StreetMode[];
};
