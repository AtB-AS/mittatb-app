import {StyleSheet} from '@atb/theme';
import {AssistantTexts, useTranslation} from '@atb/translations';
import {daysBetween, formatToSimpleDate, isSameDay} from '@atb/utils/date';
import {parseISO} from 'date-fns';
import React from 'react';
import ThemeText from '@atb/components/text';

type OptionalNextDayLabelProps = {
  departureTime: string;
  previousDepartureTime?: string;
  allSameDay: boolean;
};
export default function DayLabel({
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
    dateLabel = t(AssistantTexts.results.dayHeader.today());
  }
  if (numberOfDays == 1) {
    dateLabel = t(AssistantTexts.results.dayHeader.tomorrow(dateString));
  }
  if (numberOfDays == 2) {
    dateLabel = t(
      AssistantTexts.results.dayHeader.dayAfterTomorrow(dateString),
    );
  }

  if (isFirst || !isSameDay(prevDate, departureDate)) {
    return (
      <ThemeText type="body__secondary" style={style.title}>
        {dateLabel}
      </ThemeText>
    );
  }
  return null;
}
const useDayTextStyle = StyleSheet.createThemeHook((theme) => ({
  title: {
    paddingHorizontal: theme.spacings.medium,
    marginTop: theme.spacings.medium,
    color: theme.text.colors.secondary,
  },
}));
