import {BookingAvailabilityType} from '@atb-as/utils';

export type TripPatternDisabledReason =
  | 'expired_fare_contract'
  | 'inactive_fare_contract';

export type BookingDisabledReason =
  | TripPatternDisabledReason
  | BookingAvailabilityType.Closed
  | BookingAvailabilityType.SoldOut;
