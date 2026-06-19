import type {IconColor} from '@atb/components/theme-icon';

export type TripPatternStatus =
  | 'started'
  | 'ended'
  | 'impossible'
  | 'stale'
  | 'cancelled'
  | 'requiresBooking'
  | 'bookingDeadlineExceeded';

export type StatusTextConfig = {
  type: TripPatternStatus;
  color: IconColor;
  text: string;
};
