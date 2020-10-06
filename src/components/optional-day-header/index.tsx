import {parseISO} from 'date-fns';
import React from 'react';
import {Text} from 'react-native';
import {EstimatedCall} from '../../sdk';
import {StyleSheet} from '../../theme';
import {formatToSimpleDate, isSameDay, daysBetween} from '../../utils/date';

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
      <Text style={style.title}>
        {getHumanizedDepartureDatePrefixed(
          departureDate,
          formatToSimpleDate(departureDate),
        )}
      </Text>
    );
  }

  return null;
}
const useDayTextStyle = StyleSheet.createThemeHook((theme) => ({
  title: {
    fontSize: theme.text.sizes.lead,
    padding: theme.spacings.medium,
    color: theme.text.colors.faded,
  },
}));
function getHumanizedDepartureDatePrefixed(
  departureDate: Date,
  appendix: string,
) {
  const days = daysBetween(new Date(), departureDate);
  if (days === 0) {
    return 'I dag';
  }
  if (days == 1) {
    return `I morgen - ${appendix}`;
  }
  if (days == 2) {
    return `I overmorgen - ${appendix}`;
  }
  return appendix;
}
