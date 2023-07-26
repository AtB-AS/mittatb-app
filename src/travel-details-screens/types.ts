import {TripPattern} from '@atb/api/types/trips';

export type ServiceJourneyDeparture = {
  serviceJourneyId: string;
  date: string;
  serviceDate: string;
  fromQuayId?: string;
  toQuayId?: string;
  isTripCancelled?: boolean;
};

export type TripPatternWithKey = TripPattern & {key: string};

export type BookingRequirement = {
  requiresBooking: boolean;
  requiresBookingUrgently: boolean;
  bookingAvailableImminently: boolean;
  isTooEarly: boolean;
  isTooLate: boolean;
  secondsRemainingToDeadline: number;
  secondsRemainingToAvailable: number;
  latestBookingDate: Date;
  earliestBookingDate: Date;
};
