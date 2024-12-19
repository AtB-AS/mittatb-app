import type {QuayFragment} from '@atb/api/types/generated/fragments/quays';
import type {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import type {SituationFragment} from '@atb/api/types/generated/fragments/situations';
import type {BookingArrangementFragment} from '@atb/api/types/generated/fragments/booking-arrangements';

export type EstimatedCallWithQuayFragment = {
  actualArrivalTime?: any;
  actualDepartureTime?: any;
  aimedArrivalTime: any;
  aimedDepartureTime: any;
  cancellation: boolean;
  date: any;
  expectedDepartureTime: any;
  expectedArrivalTime: any;
  forAlighting: boolean;
  forBoarding: boolean;
  realtime: boolean;
  destinationDisplay?: {frontText?: string; via?: Array<string>};
  quay: QuayFragment;
  notices: Array<NoticeFragment>;
  situations: Array<SituationFragment>;
  bookingArrangements?: BookingArrangementFragment;
};
