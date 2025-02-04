import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {daysBetween, formatToSimpleDate, isSameDay} from '@atb/utils/date';
import {parseISO} from 'date-fns';
import React from 'react';

type OptionalNextDayLabelProps = {
  departureTime: string;
  previousDepartureTime?: string;
};
export function DayLabel({
  departureTime,
  previousDepartureTime,
}: OptionalNextDayLabelProps) {
  const style = useDayTextStyle();
  const isFirst = !previousDepartureTime;
  const departureDate = parseISO(departureTime);
  const prevDate = !previousDepartureTime
    ? new Date()
    : parseISO(previousDepartureTime);

  const {t, language} = useTranslation();

  const dateString = formatToSimpleDate(departureDate, language);
  const numberOfDays = daysBetween(new Date(), departureDate);

  let dateLabel = dateString;

  if (numberOfDays === 0) {
    dateLabel = t(TripSearchTexts.results.dayHeader.today());
  }
  if (numberOfDays == 1) {
    dateLabel = t(TripSearchTexts.results.dayHeader.tomorrow(dateString));
  }
  if (numberOfDays == 2) {
    dateLabel = t(
      TripSearchTexts.results.dayHeader.dayAfterTomorrow(dateString),
    );
  }

  if (isFirst || !isSameDay(prevDate, departureDate)) {
    return (
      <ThemeText typography="body__secondary" style={style.title}>
        {dateLabel}
      </ThemeText>
    );
  }
  return null;
}
const useDayTextStyle = StyleSheet.createThemeHook((theme) => ({
  title: {
    paddingHorizontal: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    color: theme.color.foreground.dynamic.secondary,
  },
}));
