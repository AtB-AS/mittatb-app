import {parseISO} from 'date-fns';
import React from 'react';
import {EstimatedCall} from '../../sdk';
import {StyleSheet} from '../../theme';
import {formatToSimpleDate, isSameDay, daysBetween} from '../../utils/date';
import ThemeText from '../text';

type OptionalNextDayLabelProps = {
  departureTime: string;
  previousDepartureTime?: string;
  allSameDay: boolean;
};
export default function OptionalNextDayLabel({
  departureTime,
  previousDepartureTime,
  allSameDay,
}: OptionalNextDayLabelProps) {
  const style = useDayTextStyle();
  const isFirst = !previousDepartureTime;
  const departureDate = parseISO(departureTime);
  const prevDate = !previousDepartureTime
    ? new Date()
    : parseISO(previousDepartureTime);

  if ((isFirst && !allSameDay) || !isSameDay(prevDate, departureDate)) {
    return (
      <ThemeText type="lead" style={style.title}>
        {getHumanizedDepartureDatePrefixed(
          departureDate,
          formatToSimpleDate(departureDate),
        )}
      </ThemeText>
    );
  }

  return null;
}
const useDayTextStyle = StyleSheet.createThemeHook((theme) => ({
  title: {
    padding: theme.spacings.medium,
    color: theme.text.colors.faded,
  },
}));
function getHumanizedDepartureDatePrefixed(
  departureDate: Date,
  suffix: string,
) {
  const days = daysBetween(new Date(), departureDate);
  if (days === 0) {
    return 'I dag';
  }
  if (days == 1) {
    return `I morgen - ${suffix}`;
  }
  if (days == 2) {
    return `I overmorgen - ${suffix}`;
  }
  return suffix;
}
