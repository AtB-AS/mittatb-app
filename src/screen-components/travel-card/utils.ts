import {TravelCardTexts, useTranslation} from '@atb/translations';
import {daysBetween, formatToClock, formatToSimpleDate} from '@atb/utils/date';

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
