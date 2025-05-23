import React from 'react';
import {StyleSheet} from '@atb/theme';
import {Section} from '@atb/components/sections';
import {ShmoTripDetailsSectionItem} from './ShmoTripDetailsSectionItem';
import {useTimeContext} from '@atb/modules/time';
import {useTransportColor} from '@atb/utils/use-transport-color';

import {ShmoBooking, ShmoBookingState} from '@atb/api/types/mobility';
import {LineWithVerticalBars} from '@atb/components/line-with-vertical-bars';

type ShmoTripCardProps = {
  shmoBooking: ShmoBooking;
};

export const ShmoTripCard = ({shmoBooking}: ShmoTripCardProps) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const backgroundColor = useTransportColor('scooter', 'escooter');

  return (
    <Section style={styles.container}>
      <LineWithVerticalBars
        backgroundColor={
          shmoBooking?.state === ShmoBookingState.IN_USE
            ? backgroundColor.primary.background
            : backgroundColor.primary.foreground.disabled
        }
        style={styles.lineBars}
        animate={shmoBooking?.state === ShmoBookingState.IN_USE}
      />

      <ShmoTripDetailsSectionItem
        startDateTime={shmoBooking?.departureTime ?? new Date()}
        endDateTime={
          shmoBooking?.state === ShmoBookingState.IN_USE
            ? new Date(serverNow)
            : new Date(shmoBooking?.arrivalTime ?? '')
        }
        totalAmount={shmoBooking?.pricing.currentAmount.toString() ?? ''}
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
