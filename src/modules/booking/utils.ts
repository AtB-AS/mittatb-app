import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import type {TripPatternWithBooking} from '@atb/api/types/trips';
import {isBefore, isEqualOrAfter} from '@atb/utils/date';
import {endOfDay} from 'date-fns';

export function isValidSelection(selection: PurchaseSelectionType) {
  return !!selection.stopPlaces?.from && !!selection.stopPlaces?.to;
}

export function tripPatternAvailabilityFilter(
  tp: TripPatternWithBooking,
): boolean {
  return (
    tp.booking.availability !== 'unknown' &&
    tp.booking.availability !== 'booking_not_supported'
  );
}

/**
 * Returns true for trip patterns with expected departure on or after the
 * given travelDate and before the end of that same day.
 */
export function tripPatternDisplayTimeFilter(
  tp: TripPatternWithBooking,
  travelDate: string,
): boolean {
  const isAfterSearchTime = isEqualOrAfter(tp.expectedStartTime, travelDate);
  const isBeforeEndOfDay = isBefore(tp.expectedStartTime, endOfDay(travelDate));
  return isAfterSearchTime && isBeforeEndOfDay;
}
