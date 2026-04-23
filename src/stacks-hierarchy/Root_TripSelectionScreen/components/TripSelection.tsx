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
        tripPatterns.map((tp, i) => (
          <BookingTrip
            key={`booking-trip-${i}`}
            onSelect={onSelect}
            tripPattern={tp}
          />
        ))
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

type BookingTripProps = {
  tripPattern: TripPatternWithBooking;
  onSelect: (legs: TripPatternLegs) => void;
};

export function BookingTrip({tripPattern, onSelect}: BookingTripProps) {
  const styles = useBookingTripStyles();
  const {t} = useTranslation();

  const isAvailable =
    tripPattern.booking.availability === 'available' &&
    !tripPattern.booking.disabledReason;

  const tagInfo = getBookingTagInfo(
    t,
    tripPattern.booking,
    tripPattern.booking.disabledReason,
  );

  return (
    <View
      style={[
        styles.container,
        isAvailable ? styles.containerAvailable : styles.containerDisabled,
      ]}
    >
      <TravelCard
        tripPattern={tripPattern}
        cardIndex={0}
        onDetailsPressed={() => {
          if (isAvailable) onSelect(tripPattern.legs);
        }}
        a11yPrefix={t(TravelCardTexts.card.a11yPrefix.bookingOption(0, 1))}
        includeSituationNotices
        isDisabled={!isAvailable}
        tagLabel={tagInfo?.label}
        tagType={tagInfo?.type}
      />
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

const useBookingTripStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      borderRadius: theme.border.radius.regular,
      overflow: 'hidden',
    },
    containerAvailable: {
      backgroundColor: theme.color.interactive[2].default.background,
    },
    containerDisabled: {
      backgroundColor: theme.color.background.neutral[2].background,
    },
  };
});

const useBookingTripSelectionStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      width: '100%',
      rowGap: theme.spacing.medium,
    },
  };
});
