import {TripPattern} from '@atb/api/types/trips';
import {getTripPatternBookingStatus} from '@atb/screen-components/travel-details-screens';
import type {TripPatternStatus} from './types';
import type {TranslateFunction} from '@atb/translations';
import {TravelCardTexts} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {
  BookingClosed,
  BookingRequired,
  Warning,
} from '@atb/assets/svg/mono-icons/status';
import SvgError from '@atb/assets/svg/color/icons/status/light/Error';
import {Duration} from '@atb/assets/svg/mono-icons/time';
import {isInTheFuture, isInThePast} from '@atb/utils/date';

type StatusColors = {
  error: string;
  info: string;
  interactive: string;
};

export function getTripPatternStatus(
  tripPattern: TripPattern,
  t: TranslateFunction,
  colors: StatusColors,
): TripPatternStatus | undefined {
  if (tripPattern.legs.some((leg) => leg.fromEstimatedCall?.cancellation)) {
    return {
      type: 'cancelled',
      svg: SvgError,
      color: colors.error,
      text: t(TravelCardTexts.header.cancelled),
    };
  }
  if (tripPattern.status === 'impossible') {
    return {
      type: 'impossible',
      svg: Close,
      color: 'error',
      text: t(TravelCardTexts.header.notPossible),
    };
  }

  if (
    isInThePast(tripPattern.expectedStartTime) &&
    isInTheFuture(tripPattern.expectedEndTime)
  ) {
    return {
      type: 'started',
      svg: Duration,
      color: colors.info,
      text: t(TravelCardTexts.header.tripStarted),
    };
  }

  if (tripPattern.legs.some((leg) => leg.bookingArrangements)) {
    const bookingStatus = getTripPatternBookingStatus(tripPattern);
    if (bookingStatus === 'late') {
      return {
        type: 'bookingDeadlineExceeded',
        svg: BookingClosed,
        color: colors.interactive,
        text: t(TravelCardTexts.header.bookingDeadlineExceeded),
      };
    }
    return {
      type: 'requiresBooking',
      svg: BookingRequired,
      color: colors.info,
      text: t(TravelCardTexts.header.requiresBooking),
    };
  }

  if (tripPattern.status === 'stale') {
    return {
      type: 'stale',
      svg: Warning,
      color: colors.info,
      text: t(TravelCardTexts.header.staleTrip),
    };
  }

  return undefined;
}
