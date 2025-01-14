import {TripPattern} from '@atb/api/types/trips';

export type ServiceJourneyDeparture = {
  serviceJourneyId: string;
  date: string;
  serviceDate: string;
  fromStopPosition: number;
  toStopPosition?: number;
  isTripCancelled?: boolean;
};

export type TripPatternWithKey = TripPattern & {key: string};

export type BookingStatus = 'none' | 'early' | 'bookable' | 'late';
export type TripPatternBookingStatus = Exclude<BookingStatus, 'early'>;
