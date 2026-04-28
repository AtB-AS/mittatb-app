import {TravelCardTexts, TranslateFunction, useTranslation} from '@atb/translations';
import {daysBetween, formatToClock, formatToSimpleDate, isInThePast} from '@atb/utils/date';

/**
 * Returns the time label for the expected start and end times. If the start time is today, the day information is not included.
 */
export function useTimeLabels(
  startTime: Date,
  endTime: Date,
  includeDayInfo: boolean,
) {
  const {t, language} = useTranslation();
  const numberOfDays = daysBetween(new Date(), startTime);
  const isToday = numberOfDays === 0;

  let dateLabel = formatToSimpleDate(startTime, language);

  if (numberOfDays == 1) {
    dateLabel = t(TravelCardTexts.header.day.tomorrow);
  }
  if (numberOfDays == 2) {
    dateLabel = t(TravelCardTexts.header.day.dayAfterTomorrow);
  }

  const startTimeLabel = formatToClock(startTime, language, 'floor');
  const endTimeLabel = formatToClock(endTime, language, 'ceil');

  return {
    startTimeLabel: `${includeDayInfo && !isToday ? dateLabel + ', ' : ''}${startTimeLabel}`,
    endTimeLabel,
  };
}

import {TripPattern} from '@atb/api/types/trips';
import {getTripPatternBookingStatus} from '@atb/screen-components/travel-details-screens';
import type {TripPatternStatus} from './types';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {Duration} from '@atb/assets/svg/mono-icons/time';
import {
  Error as ErrorIcon,
  Info,
  Warning,
} from '@atb/assets/svg/mono-icons/status';

export function getTripPatternStatus(
  tripPattern: TripPattern,
  t: TranslateFunction,
): TripPatternStatus | undefined {
  if (tripPattern.status === 'impossible') {
    return {
      type: 'impossible',
      svg: Close,
      color: 'error',
      text: t(TravelCardTexts.header.notPossible),
    };
  }

  if (tripPattern.legs.some((leg) => leg.fromEstimatedCall?.cancellation)) {
    return {
      type: 'cancelled',
      svg: ErrorIcon,
      color: 'error',
      text: t(TravelCardTexts.header.cancelled),
    };
  }

  if (tripPattern.status === 'stale') {
    return {
      type: 'stale',
      svg: Warning,
      color: 'warning',
      text: t(TravelCardTexts.header.staleTrip),
    };
  }

  if (tripPattern.legs.some((leg) => leg.bookingArrangements)) {
    const bookingStatus = getTripPatternBookingStatus(tripPattern);
    if (bookingStatus === 'late') {
      return {
        type: 'bookingDeadlineExceeded',
        svg: Warning,
        color: 'warning',
        text: t(TravelCardTexts.header.bookingDeadlineExceeded),
      };
    }
    return {
      type: 'requiresBooking',
      svg: Info,
      color: 'info',
      text: t(TravelCardTexts.header.requiresBooking),
    };
  }

  if (isInThePast(tripPattern.expectedEndTime)) {
    return {
      type: 'ended',
      svg: Close,
      color: 'error',
      text: t(TravelCardTexts.header.notPossible),
    };
  }

  if (isInThePast(tripPattern.expectedStartTime)) {
    return {
      type: 'started',
      svg: Duration,
      color: '#337fcc',
      text: t(TravelCardTexts.header.tripStarted),
    };
  }

  return undefined;
}
