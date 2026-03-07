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
 * Returns true for trip patterns that should be displayed to the user.
 * That is trip patterns for the selected day (midnight to midnight),
 * and trip patterns with departure after now
 */
export function tripPatternDisplayTimeFilter(
  tp: TripPatternWithBooking,
  travelDate: string,
): boolean {
  return (
    isEqualOrAfter(tp.expectedStartTime, travelDate) &&
    isBefore(tp.expectedStartTime, endOfDay(travelDate))
  );
}
