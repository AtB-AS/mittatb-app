import {TripPattern} from '@atb/api/types/trips';

// NOTE: The iOS departure widget is dependent on this type. When changing it,
// make sure to update the widget as well.
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
