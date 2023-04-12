import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

export type BookingArrangementFragment = {
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
