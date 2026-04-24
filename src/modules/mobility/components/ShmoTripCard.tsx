import React from 'react';
import {StyleSheet} from '@atb/theme';
import {Section} from '@atb/components/sections';
import {ShmoTripDetailsSectionItem} from './ShmoTripDetailsSectionItem';
import {useTimeContext} from '@atb/modules/time';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {ShmoBooking, ShmoBookingState} from '@atb/api/types/mobility';
import {LineWithVerticalBars} from '@atb/components/line-with-vertical-bars';
import {View} from 'react-native';
import {ONE_MINUTE_MS, ONE_SECOND_MS} from '@atb/utils/durations';

type ShmoTripCardProps = {
  shmoBooking: ShmoBooking;
  isFocused: boolean;
  mode: AnyMode;
  subMode?: AnySubMode;
};

export const ShmoTripCard = ({
  shmoBooking,
  isFocused,
  mode,
  subMode,
}: ShmoTripCardProps) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext(
    isFocused ? ONE_SECOND_MS : ONE_MINUTE_MS * 5,
  );
  const backgroundColor = useTransportColor(mode, subMode);

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
        currency={shmoBooking?.pricingPlan.currency}
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
