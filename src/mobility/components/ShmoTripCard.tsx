import React from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Section} from '@atb/components/sections';
import {ShmoTripDetailsSectionItem} from './ShmoTripDetailsSectionItem';
import {useTimeContext} from '@atb/time';
import {LineWithVerticalBars} from '@atb/fare-contracts/components/ValidityLine';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {useShmoBookingQuery} from '../queries/use-shmo-booking-query';
import {ShmoBooking} from '@atb/api/types/mobility';

type Props = {
  bookingId: ShmoBooking['bookingId'];
  isDisabled: boolean;
};

export const ShmoTripCard = ({bookingId, isDisabled}: Props) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const {theme} = useThemeContext();
  const lineColor = theme.color.background.neutral[0].background;
  const backgroundColor = useTransportColor('scooter', 'escooter');
  const {data: booking} = useShmoBookingQuery(bookingId, 15000);

  if (!booking) {
    return null;
  }

  return (
    <Section style={styles.container}>
      <LineWithVerticalBars
        backgroundColor={
          isDisabled
            ? backgroundColor.primary.foreground.disabled
            : backgroundColor.primary.background
        }
        lineColor={lineColor}
        style={styles.LineBars}
        animate={!isDisabled}
      />

      <ShmoTripDetailsSectionItem
        startDateTime={booking.departureTime ?? new Date()}
        endDateTime={
          isDisabled
            ? new Date(booking.arrivalTime ?? booking.departureTime ?? '')
            : new Date(serverNow)
        }
        totalAmount={booking?.pricing.currentAmount.toString() ?? ''}
        withHeader={false}
      />
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    LineBars: {
      borderTopLeftRadius: theme.border.radius.regular,
      borderTopRightRadius: theme.border.radius.regular,
    },
  };
});
