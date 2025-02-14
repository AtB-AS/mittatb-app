import React from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Section} from '@atb/components/sections';
import {ShmoTripDetailsSectionItem} from './ShmoTripDetailsSectionItem';
import {useTimeContext} from '@atb/time';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {useShmoBookingQuery} from '../queries/use-shmo-booking-query';
import {ShmoBooking, ShmoBookingState} from '@atb/api/types/mobility';
import {LineWithVerticalBars} from '@atb/components/LineWithVerticalLine';

type ShmoTripCardProps = {
  bookingId: ShmoBooking['bookingId'];
};

export const ShmoTripCard = ({bookingId}: ShmoTripCardProps) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const {theme} = useThemeContext();
  const lineColor = theme.color.background.neutral[0].background;
  const backgroundColor = useTransportColor('scooter', 'escooter');
  const {data: booking} = useShmoBookingQuery(bookingId, 15000);

  return (
    <Section style={styles.container}>
      <LineWithVerticalBars
        backgroundColor={
          booking?.state === ShmoBookingState.IN_USE
            ? backgroundColor.primary.background
            : backgroundColor.primary.foreground.disabled
        }
        lineColor={lineColor}
        style={styles.lineBars}
        animate={booking?.state === ShmoBookingState.IN_USE}
      />

      <ShmoTripDetailsSectionItem
        startDateTime={booking?.departureTime ?? new Date()}
        endDateTime={
          booking?.state === ShmoBookingState.IN_USE
            ? new Date(serverNow)
            : new Date(booking?.arrivalTime ?? '')
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
    lineBars: {
      borderTopLeftRadius: theme.border.radius.regular,
      borderTopRightRadius: theme.border.radius.regular,
    },
  };
});
