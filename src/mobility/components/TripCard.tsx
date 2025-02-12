import React, {useEffect} from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ShmoTripDetailsSectionItem} from './ShmoTripDetailsSectionItem';
import {useTimeContext} from '@atb/time';
import {LineWithVerticalBars} from '@atb/fare-contracts/components/ValidityLine';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {useShmoBookingQuery} from '../queries/use-shmo-booking-query';

type Props = {
  bookingId: string;
};

export const TripCard = ({bookingId}: Props) => {
  const styles = useStyles();
  const {serverNow} = useTimeContext();
  const {theme} = useThemeContext();
  const lineColor = theme.color.background.neutral[0].background;
  const backgroundColor = useTransportColor('scooter', 'escooter');
  const {data: booking} = useShmoBookingQuery(bookingId, 30000);

  if (!booking) {
    return null;
  }

  return (
    <Section style={styles.container}>
      <LineWithVerticalBars
        backgroundColor={backgroundColor.primary.background}
        lineColor={lineColor}
        style={{
          borderTopLeftRadius: theme.border.radius.regular,
          borderTopRightRadius: theme.border.radius.regular,
        }}
      />

      <ShmoTripDetailsSectionItem
        startDateTime={booking.departureTime ?? new Date()}
        endDateTime={new Date(serverNow)}
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
  };
});
