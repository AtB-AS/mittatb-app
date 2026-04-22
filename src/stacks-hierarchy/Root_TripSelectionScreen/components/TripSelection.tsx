import {type PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {View} from 'react-native';
import React from 'react';
import {
  type BookingDisabledReason,
  useBookingTrips,
} from '@atb/modules/booking';
import type {TripPatternLegs} from '../types';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TripPatternWithBooking} from '@atb/api/types/trips';
import {Tag} from '@atb/components/tag';
import {ThemeText} from '@atb/components/text';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {
  TicketingTexts,
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

  const rawTagLabel = getBookingTagLabel(
    t,
    tripPattern.booking,
    tripPattern.booking.disabledReason,
  );
  const tagLabel = rawTagLabel ? `. ${rawTagLabel}` : undefined;

  return (
    <View
      style={[
        styles.container,
        isAvailable ? styles.containerAvailable : styles.containerDisabled,
      ]}
    >
      <View aria-hidden={true}>
        <TripSelectionTag
          bookingInfo={tripPattern.booking}
          disabledReason={tripPattern.booking.disabledReason}
        />
      </View>
      <TravelCard
        tripPattern={tripPattern}
        cardIndex={0}
        numberOfCards={1}
        onDetailsPressed={() => {
          if (isAvailable) onSelect(tripPattern.legs);
        }}
        type="booking"
        isDisabled={!isAvailable}
        extraA11yLabels={{tag: tagLabel}}
        extraA11yOrder={{after: ['tag']}}
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

function getBookingTagLabel(
  t: TranslateFunction,
  bookingInfo: TripPatternWithBooking['booking'],
  disabledReason?: BookingDisabledReason,
): string | undefined {
  if (disabledReason === 'expired_fare_contract') {
    return t(TicketingTexts.booking.expiredFareContract);
  } else if (disabledReason === 'inactive_fare_contract') {
    return t(TicketingTexts.booking.beforeStartOfFareContract);
  } else if (bookingInfo.availability === 'closed') {
    return t(TicketingTexts.booking.closed);
  } else if (bookingInfo.availability === 'sold_out') {
    return t(TicketingTexts.booking.soldOut);
  }
  const availableSeats = bookingInfo?.offer?.available ?? 0;
  if (!!availableSeats && availableSeats <= SEAT_TAG_LIMIT) {
    return t(TicketingTexts.booking.numAvailableTickets(availableSeats));
  }
  return undefined;
}

/**
 * We only want to show one tag at a time
 */
function TripSelectionTag({
  bookingInfo,
  disabledReason,
}: {
  bookingInfo: TripPatternWithBooking['booking'];
  disabledReason?: BookingDisabledReason;
}) {
  const {t} = useTranslation();
  const styles = useTripSelectionTagStyles();
  const availableSeats = bookingInfo?.offer?.available ?? 0;

  let tag: React.ReactNode = null;

  if (disabledReason === 'expired_fare_contract') {
    tag = (
      <Tag
        labels={[t(TicketingTexts.booking.expiredFareContract)]}
        tagType="info"
      />
    );
  } else if (disabledReason === 'inactive_fare_contract') {
    tag = (
      <Tag
        labels={[t(TicketingTexts.booking.beforeStartOfFareContract)]}
        tagType="info"
      />
    );
  } else if (bookingInfo.availability === 'closed') {
    tag = <Tag labels={[t(TicketingTexts.booking.closed)]} tagType="warning" />;
  } else if (bookingInfo.availability === 'sold_out') {
    tag = (
      <Tag labels={[t(TicketingTexts.booking.soldOut)]} tagType="warning" />
    );
  } else if (!!availableSeats && availableSeats <= SEAT_TAG_LIMIT) {
    tag = (
      <Tag
        labels={[t(TicketingTexts.booking.numAvailableTickets(availableSeats))]}
        tagType="info"
      />
    );
  }

  if (!tag) return null;

  return <View style={styles.tagContainer}>{tag}</View>;
}

const useTripSelectionTagStyles = StyleSheet.createThemeHook((theme) => ({
  tagContainer: {
    padding: theme.spacing.medium,
    paddingBottom: 0,
  },
}));

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
