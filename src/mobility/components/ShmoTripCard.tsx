import React, {useEffect, useState} from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Section} from '@atb/components/sections';
import {ShmoTripDetailsSectionItem} from './ShmoTripDetailsSectionItem';
import {useTimeContext} from '@atb/time';
import {LineWithVerticalBars} from '@atb/fare-contracts/components/ValidityLine';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {useShmoBookingQuery} from '../queries/use-shmo-booking-query';
import {ShmoBooking, ShmoBookingState} from '@atb/api/types/mobility';

type Props = {
  bookingId: ShmoBooking['bookingId'];
  activeBookingState: ShmoBookingState;
};

export const ShmoTripCard = ({bookingId, activeBookingState}: Props) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const {theme} = useThemeContext();
  const lineColor = theme.color.background.neutral[0].background;
  const backgroundColor = useTransportColor('scooter', 'escooter');
  const [freezedTime, setFreezedTime] = useState<number | null>(null);
  const {data: booking, refetch} = useShmoBookingQuery(bookingId, 15000);

  useEffect(() => {
    setFreezedTime(serverNow);
    refetch();
  }, [activeBookingState]);

  return (
    <Section style={styles.container}>
      <LineWithVerticalBars
        backgroundColor={
          activeBookingState === ShmoBookingState.IN_USE
            ? backgroundColor.primary.background
            : backgroundColor.primary.foreground.disabled
        }
        lineColor={lineColor}
        style={styles.lineBars}
        animate={activeBookingState === ShmoBookingState.IN_USE}
      />

      <ShmoTripDetailsSectionItem
        startDateTime={booking?.departureTime ?? new Date()}
        endDateTime={
          activeBookingState === ShmoBookingState.IN_USE
            ? new Date(serverNow)
            : new Date(booking?.arrivalTime ?? freezedTime ?? '')
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
