import React from 'react';
import {StyleSheet} from '@atb/theme';
import {Section} from '@atb/components/sections';
import {ShmoTripDetailsSectionItem} from './ShmoTripDetailsSectionItem';
import {useTimeContext} from '@atb/modules/time';
import {useTransportColor} from '@atb/utils/use-transport-color';

import {ShmoBooking, ShmoBookingState} from '@atb/api/types/mobility';
import {LineWithVerticalBars} from '@atb/components/line-with-vertical-bars';
import {View} from 'react-native';

type ShmoTripCardProps = {
  shmoBooking: ShmoBooking;
};

export const ShmoTripCard = ({shmoBooking}: ShmoTripCardProps) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const backgroundColor = useTransportColor('scooter', 'escooter');

  return (
    <Section>
      <View style={styles.lineWrapper}>
        <LineWithVerticalBars
          backgroundColor={
            shmoBooking?.state === ShmoBookingState.IN_USE
              ? backgroundColor.primary.background
              : backgroundColor.primary.foreground.disabled
          }
          animate={shmoBooking?.state === ShmoBookingState.IN_USE}
        />
      </View>

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
    lineWrapper: {
      borderTopRightRadius: theme.border.radius.regular,
      borderTopLeftRadius: theme.border.radius.regular,
      overflow: 'hidden',
      flex: 1,
    },
  };
});
