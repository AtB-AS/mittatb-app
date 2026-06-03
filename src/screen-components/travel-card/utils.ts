import {Leg, TripPattern} from '@atb/api/types/trips';
import {getTripPatternBookingStatus} from '@atb/screen-components/travel-details-screens';
// Import directly from the modules' utils instead of their index files, since
// the index files pull in React components whose import chains require native
// modules, which are not available in the Jest environment. Going through the
// index files would break every test importing from this file.
// eslint-disable-next-line no-restricted-imports
import {
  getMsgTypeForLeg,
  toMostCriticalStatus,
} from '@atb/modules/situations/utils';
// eslint-disable-next-line no-restricted-imports
import {isShortWaitTime} from '@atb/modules/trip-patterns/utils';
import {Statuses} from '@atb/theme';
import type {StatusTextConfig, TripPatternStatus} from './types';
import type {TranslateFunction} from '@atb/translations';
import {TravelCardTexts} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import SvgError from '@atb/assets/svg/color/icons/status/light/Error';
import {
  BookingClosed,
  BookingRequired,
  Check,
  Warning,
} from '@atb/assets/svg/mono-icons/status';
import {Duration} from '@atb/assets/svg/mono-icons/time';
import {isInThePast, secondsBetween} from '@atb/utils/date';

type StatusColors = {
  error: string;
  info: string;
  interactive: string;
};

export function getTripPatternStatus(
  tripPattern: TripPattern,
): TripPatternStatus | undefined {
  if (tripPattern.legs.some((l) => l.fromEstimatedCall?.cancellation))
    return 'cancelled';
  if (tripPattern.status === 'impossible') return 'impossible';
  if (isInThePast(tripPattern.expectedEndTime)) return 'ended';
  if (isInThePast(tripPattern.expectedStartTime)) return 'started';
  if (tripPattern.legs.some((leg) => leg.bookingArrangements)) {
    const bookingStatus = getTripPatternBookingStatus(tripPattern);
    return bookingStatus === 'late'
      ? 'bookingDeadlineExceeded'
      : 'requiresBooking';
  }
  if (tripPattern.status === 'stale') return 'stale';
  return undefined;
}

/**
 * Get the most critical message type for a leg in the travel card, considering
 * both leg-specific notifications (situations, notices, etc.) and short
 * transfer time from the previous leg. Transfer time is only considered for
 * transit legs.
 */
export function getMsgTypeForTravelCardLeg(
  legs: Leg[],
  index: number,
): Exclude<Statuses, 'valid'> | undefined {
  const leg = legs[index];
  const legMsgType = getMsgTypeForLeg(leg);
  if (leg.mode === 'foot') return legMsgType;
  const previousLeg = legs[index - 1];
  const waitTimeInSeconds = previousLeg
    ? secondsBetween(previousLeg.expectedEndTime, leg.expectedStartTime)
    : 0;
  const shortTransferMsgType: Exclude<Statuses, 'valid'> | undefined =
    isShortWaitTime(waitTimeInSeconds) ? 'info' : undefined;
  return toMostCriticalStatus(legMsgType, shortTransferMsgType);
}

export function getStatusTextConfig(
  tripPattern: TripPattern,
  t: TranslateFunction,
  colors: StatusColors,
): StatusTextConfig | undefined {
  switch (getTripPatternStatus(tripPattern)) {
    case 'cancelled':
      return {
        type: 'cancelled',
        svg: SvgError,
        color: colors.error,
        text: t(TravelCardTexts.header.cancelled),
      };
    case 'impossible':
      return {
        type: 'impossible',
        svg: Close,
        color: 'error',
        text: t(TravelCardTexts.header.notPossible),
      };
    case 'ended':
      return {
        type: 'ended',
        svg: Check,
        color: colors.error,
        text: t(TravelCardTexts.header.tripEnded),
      };
    case 'started':
      return {
        type: 'started',
        svg: Duration,
        color: colors.info,
        text: t(TravelCardTexts.header.tripStarted),
      };
    case 'bookingDeadlineExceeded':
      return {
        type: 'bookingDeadlineExceeded',
        svg: BookingClosed,
        color: colors.interactive,
        text: t(TravelCardTexts.header.bookingDeadlineExceeded),
      };
    case 'requiresBooking':
      return {
        type: 'requiresBooking',
        svg: BookingRequired,
        color: colors.info,
        text: t(TravelCardTexts.header.requiresBooking),
      };
    case 'stale':
      return {
        type: 'stale',
        svg: Warning,
        color: colors.info,
        text: t(TravelCardTexts.header.staleTrip),
      };
    default:
      return undefined;
  }
}
