import * as Types from '../journey_planner_v3_types';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import type {TariffZoneFragment} from '@atb/api/types/generated/fragments/tariffZone';
import type {BookingArrangementFragment} from '@atb/api/types/generated/fragments/booking-arrangements';
import type {AuthorityFragment} from '@atb/api/types/generated/fragments/authority';
import type {LineFragment} from '@atb/api/types/generated/fragments/lines';

export type TripFragment = {
  nextPageCursor?: string;
  previousPageCursor?: string;
  metadata?: {nextDateTime?: any; prevDateTime?: any; searchWindowUsed: number};
  tripPatterns: Array<TripPatternFragment>;
};

export type TripPatternFragment = {
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
    line?: {name?: string} & LineFragment;
    fromEstimatedCall?: {
      aimedDepartureTime: any;
      expectedDepartureTime: any;
      stopPositionInPattern: number;
      destinationDisplay?: {frontText?: string; via?: Array<string>};
      quay: {publicCode?: string; name: string};
      notices: Array<NoticeFragment>;
    };
    toEstimatedCall?: {stopPositionInPattern: number};
    situations: Array<SituationFragment>;
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
        situations: Array<SituationFragment>;
        tariffZones: Array<TariffZoneFragment>;
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
        situations: Array<SituationFragment>;
        tariffZones: Array<TariffZoneFragment>;
      };
    };
    serviceJourney?: {
      id: string;
      notices: Array<NoticeFragment>;
      journeyPattern?: {notices: Array<NoticeFragment>};
    };
    interchangeTo?: {
      guaranteed?: boolean;
      maximumWaitTime?: number;
      staySeated?: boolean;
      toServiceJourney?: {id: string};
    };
    pointsOnLink?: {points?: string; length?: number};
    intermediateEstimatedCalls: Array<{
      date: any;
      quay: {name: string; id: string};
    }>;
    authority?: AuthorityFragment;
    serviceJourneyEstimatedCalls: Array<{
      actualDepartureTime?: any;
      realtime: boolean;
      aimedDepartureTime: any;
      expectedDepartureTime: any;
      predictionInaccurate: boolean;
      quay: {name: string};
    }>;
    bookingArrangements?: BookingArrangementFragment;
    datedServiceJourney?: {
      id: string;
      estimatedCalls?: Array<{
        actualDepartureTime?: any;
        predictionInaccurate: boolean;
        quay: {name: string};
      }>;
    };
  }>;
};
