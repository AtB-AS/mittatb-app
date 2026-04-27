import {
  TravelCardTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {isInThePast} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';

import {TripPattern} from '@atb/api/types/trips';
import {isLineFlexibleTransport, getTripPatternBookingStatus} from '@atb/screen-components/travel-details-screens';
import type {TripPatternStatus} from './types';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {Duration} from '@atb/assets/svg/mono-icons/time';
import {Info, Warning} from '@atb/assets/svg/mono-icons/status';

export const useTripPatternInfo = (tripPattern: TripPattern) => {
  const {t} = useTranslation();
  let from = tripPattern.legs[0];
  let fromName = from.fromPlace.name;
  const to = tripPattern.legs[tripPattern.legs.length - 1];
  const toName = to.toPlace.name ?? '';
  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    from = tripPattern.legs[1];
    fromName = getQuayName(from.fromPlace.quay);
  } else if (tripPattern.legs[0].mode !== 'foot') {
    fromName = getQuayName(from.fromPlace.quay);
  }

  const startLegIsFlexibleTransport = isLineFlexibleTransport(from.line);
  const transportName = t(getTranslatedModeName(from.mode));
  const publicCode = from.fromPlace.quay?.publicCode || from.line?.publicCode;

  fromName = fromName
    ? fromName
    : startLegIsFlexibleTransport && publicCode
      ? t(TravelCardTexts.header.flexTransportInfo(publicCode))
      : transportName;

  const {expectedStartTime, expectedEndTime} = tripPattern;
  const aimedStartTime =
    tripPattern.aimedStartTime ?? tripPattern.legs[0].aimedStartTime;
  const aimedEndTime =
    tripPattern.aimedEndTime ??
    tripPattern.legs[tripPattern.legs.length - 1].aimedEndTime;

  const isInPast = isInThePast(expectedStartTime);
  const isEnded = isInThePast(expectedEndTime);

  const status = getTripPatternStatus(tripPattern, t);

  return {
    fromName,
    toName,
    expectedStartTime,
    expectedEndTime,
    aimedStartTime,
    aimedEndTime,
    isInPast,
    isEnded,
    status,
  };
};

function getTripPatternStatus(
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
