import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {AuthorityFragment} from '@atb/api/types/generated/fragments/authority';
import type {BookingArrangementFragment} from '@atb/api/types/generated/fragments/booking-arrangements';
import type {LineFragment} from '@atb/api/types/generated/fragments/lines';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import type {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import type {TariffZoneFragment} from '@atb/api/types/generated/fragments/tariffZone';

export type LegFragment = {
  id?: string;
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
    actualDepartureTime?: any;
    aimedDepartureTime: any;
    expectedDepartureTime: any;
    stopPositionInPattern: number;
    cancellation: boolean;
    destinationDisplay?: {frontText?: string; via?: Array<string>};
    quay: {publicCode?: string; name: string};
    notices: Array<NoticeFragment>;
    situations: Array<SituationFragment>;
  };
  toEstimatedCall?: {
    actualArrivalTime?: any;
    stopPositionInPattern: number;
    cancellation: boolean;
    notices: Array<NoticeFragment>;
    situations: Array<SituationFragment>;
  };
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
      description?: string;
      stopPlace?: StopPlaceFragment;
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
      description?: string;
      stopPlace?: StopPlaceFragment;
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
    stopPositionInPattern: number;
    aimedDepartureTime: any;
    expectedDepartureTime: any;
    realtime: boolean;
    quay: {name: string; id: string; stopPlace?: StopPlaceFragment};
  }>;
  authority?: AuthorityFragment;
  serviceJourneyEstimatedCalls: Array<{
    actualDepartureTime?: any;
    realtime: boolean;
    aimedDepartureTime: any;
    expectedDepartureTime: any;
    predictionInaccurate: boolean;
    cancellation: boolean;
    quay: {name: string};
  }>;
  bookingArrangements?: BookingArrangementFragment;
  datedServiceJourney?: {
    id: string;
    estimatedCalls: Array<{
      actualDepartureTime?: any;
      predictionInaccurate: boolean;
      quay: {name: string};
    }>;
  };
};
