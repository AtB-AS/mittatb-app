import {type PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {View} from 'react-native';
import React from 'react';
import {
  type BookingDisabledReason,
  useBookingTrips,
} from '@atb/modules/booking';
import type {TripPatternLegs} from '../types';
import {StyleSheet, useThemeContext, Statuses} from '@atb/theme';
import {TripPatternWithBooking} from '@atb/api/types/trips';
import {ThemeText} from '@atb/components/text';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {
  TicketingTexts,
  TravelCardTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {ThemedOnBehalfOf} from '@atb/theme/ThemedAssets';
import {Loading} from '@atb/components/loading';
import {BookingValidityInfoBox} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/components/BookingValidityInfoBox';
import {TravelCard} from '@atb/screen-components/travel-card';

type BookingTripSelectionProps = {
  selection: PurchaseSelectionType;
  onSelect: (legs: TripPatternLegs) => void;
};

const SEAT_TAG_LIMIT = 15;

export function BookingTripSelection({
  selection,
  onSelect,
}: BookingTripSelectionProps) {
  const styles = useBookingTripSelectionStyles();
  const {t} = useTranslation();
  const {
    tripPatterns,
    isEmpty,
    isLoadingBooking: isLoading,
    reload,
  } = useBookingTrips({
    selection,
  });

  // Refetch in case the availability has changed
  useDoOnceWhen(reload, true, true);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BookingValidityInfoBox
        tripPatterns={tripPatterns}
        originFareContract={selection.originFareContract}
      />
      {!isEmpty ? (
        tripPatterns.map((tp, i) => {
          const isAvailable =
            tp.booking.availability === 'available' &&
            !tp.booking.disabledReason;
          const tagInfo = getBookingTagInfo(
            t,
            tp.booking,
            tp.booking.disabledReason,
          );
          return (
            <TravelCard
              key={`booking-trip-${i}`}
              tripPattern={tp}
              onDetailsPressed={() => {
                if (isAvailable) onSelect(tp.legs);
              }}
              a11yLabelPrefix={t(
                TravelCardTexts.card.a11yPrefix.bookingOption(
                  i,
                  tripPatterns.length,
                ),
              )}
              includeSituationNotices
              isDisabled={!isAvailable}
              tag={tagInfo}
            />
          );
        })
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

function EmptyState() {
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ThemedOnBehalfOf />
      <ThemeText
        typography="body__m__strong"
        color={theme.color.foreground.dynamic.secondary}
      >
        {t(TicketingTexts.booking.cannotFindDepartures)}
      </ThemeText>
      <ThemeText
        typography="body__s"
        color={theme.color.foreground.dynamic.secondary}
      >
        {t(TicketingTexts.booking.adjustTime)}
      </ThemeText>
    </View>
  );
}

function getBookingTagInfo(
  t: TranslateFunction,
  bookingInfo: TripPatternWithBooking['booking'],
  disabledReason?: BookingDisabledReason,
): {label: string; type: Statuses} | undefined {
  if (disabledReason === 'expired_fare_contract') {
    return {label: t(TicketingTexts.booking.expiredFareContract), type: 'info'};
  } else if (disabledReason === 'inactive_fare_contract') {
    return {
      label: t(TicketingTexts.booking.beforeStartOfFareContract),
      type: 'info',
    };
  } else if (bookingInfo.availability === 'closed') {
    return {label: t(TicketingTexts.booking.closed), type: 'warning'};
  } else if (bookingInfo.availability === 'sold_out') {
    return {label: t(TicketingTexts.booking.soldOut), type: 'warning'};
  }
  const availableSeats = bookingInfo?.offer?.available ?? 0;
  if (!!availableSeats && availableSeats <= SEAT_TAG_LIMIT) {
    return {
      label: t(TicketingTexts.booking.numAvailableTickets(availableSeats)),
      type: 'info',
    };
  }
  return undefined;
}

const useBookingTripSelectionStyles = StyleSheet.createThemeHook(() => {
  return {
    container: {
      width: '100%',
    },
  };
});
