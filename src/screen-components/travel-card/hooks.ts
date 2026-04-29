import {TravelCardTexts, useTranslation} from '@atb/translations';
import {
  daysBetween,
  formatToClock,
  formatToSimpleDate,
  isInThePast,
} from '@atb/utils/date';
import {TripPattern} from '@atb/api/types/trips';
import {isLineFlexibleTransport} from '@atb/screen-components/travel-details-screens';
import {useThemeContext} from '@atb/theme';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';
import {getTripPatternStatus} from './utils';

export const useTripPatternInfo = (tripPattern: TripPattern) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();

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

  const status = getTripPatternStatus(
    tripPattern,
    t,
    theme.color.foreground.emphasis,
  );

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
