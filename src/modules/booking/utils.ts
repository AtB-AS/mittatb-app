import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import type {TripPatternWithBooking} from '@atb/api/types/trips';
import {isBefore, isEqualOrAfter} from '@atb/utils/date';
import {endOfDay, subSeconds} from 'date-fns';

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
 * given travelDate (minus an optional grace period) and before the end of
 * that same day.
 *
 * @param gracePeriodSeconds - Number of seconds before travelDate to still
 *   include. For example, 600 allows trips that departed up to 10 minutes
 *   before travelDate.
 */
export function tripPatternDisplayTimeFilter(
  tp: TripPatternWithBooking,
  travelDate: string,
  gracePeriodSeconds: number = 0,
): boolean {
  const earliestTime = subSeconds(new Date(travelDate), gracePeriodSeconds);
  const isAfterSearchTime = isEqualOrAfter(tp.expectedStartTime, earliestTime);
  const isBeforeEndOfDay = isBefore(tp.expectedStartTime, endOfDay(travelDate));
  return isAfterSearchTime && isBeforeEndOfDay;
}
