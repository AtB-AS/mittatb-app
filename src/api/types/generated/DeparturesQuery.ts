import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import type {BookingArrangementFragment} from '@atb/api/types/generated/fragments/booking-arrangements';

export type DeparturesQuery = {
  quays: Array<{
    id: string;
    description?: string;
    publicCode?: string;
    name: string;
    estimatedCalls: Array<{
      date: any;
      expectedDepartureTime: any;
      aimedDepartureTime: any;
      realtime: boolean;
      predictionInaccurate: boolean;
      cancellation: boolean;
      stopPositionInPattern: number;
      quay: {id: string};
      destinationDisplay?: {frontText?: string; via?: Array<string>};
      serviceJourney: {
        id: string;
        transportMode?: Types.TransportMode;
        transportSubmode?: Types.TransportSubmode;
        line: {
          id: string;
          description?: string;
          publicCode?: string;
          transportMode?: Types.TransportMode;
          transportSubmode?: Types.TransportSubmode;
          notices: Array<NoticeFragment>;
        };
        journeyPattern?: {notices: Array<NoticeFragment>};
        notices: Array<NoticeFragment>;
      };
      situations: Array<SituationFragment>;
      notices: Array<NoticeFragment>;
      bookingArrangements?: BookingArrangementFragment;
    }>;
    situations: Array<SituationFragment>;
  }>;
};
