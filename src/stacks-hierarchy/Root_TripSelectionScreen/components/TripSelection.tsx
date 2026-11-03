import {type PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {View} from 'react-native';
import React from 'react';
import {
  type BookingDisabledReason,
  useBookingTrips,
} from '@atb/modules/booking';
import type {TripPatternLegs} from '../types';
import {StyleSheet, Statuses} from '@atb/theme';
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
import {BookingValidityInfoBox} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/components/BookingValidityInfoBox';
import {
  TravelCard,
  WithTravelCardSkeleton,
} from '@atb/screen-components/travel-card';

const BOOKING_SKELETON_COUNT = 3;
const SEAT_TAG_LIMIT = 15;

type BookingTripSelectionProps = {
  selection: PurchaseSelectionType;
  onSelect: (legs: TripPatternLegs) => void;
};

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

  // Index-keyed so the slot (and its skeleton) persists from loading through
  // measure, keeping the shimmer continuous.
  const slotCount =
    tripPatterns.length || (isLoading ? BOOKING_SKELETON_COUNT : 0);

  return (
    <View style={styles.container}>
      {!isLoading && (
        <BookingValidityInfoBox
          tripPatterns={tripPatterns}
          originFareContract={selection.originFareContract}
        />
      )}
      {!isLoading && isEmpty ? (
        <EmptyState />
      ) : (
        <View style={styles.travelCardsList}>
          {Array.from({length: slotCount}, (_, i) => {
            const tp = tripPatterns[i];
            return (
              <WithTravelCardSkeleton key={i}>
                {tp &&
                  (({onReady}) => (
                    <TravelCard
                      tripPattern={tp}
                      onDetailsPressed={() => {
                        const isAvailable =
                          tp.booking.availability === 'available' &&
                          !tp.booking.disabledReason;
                        if (isAvailable) onSelect(tp.legs);
                      }}
                      a11yLabelPrefix={t(
                        TravelCardTexts.card.a11yPrefix.bookingOption(
                          i,
                          tripPatterns.length,
                        ),
                      )}
                      a11yHint={t(
                        selection.isOnBehalfOf
                          ? TravelCardTexts.card.a11yHint.chooseRecipient
                          : TravelCardTexts.card.a11yHint.ticketSummary,
                      )}
                      includeTransportInfo
                      includeSituationsAndNotices
                      isDisabled={
                        tp.booking.availability !== 'available' ||
                        !!tp.booking.disabledReason
                      }
                      tag={getBookingTagInfo(
                        t,
                        tp.booking,
                        tp.booking.disabledReason,
                      )}
                      onReady={onReady}
                    />
                  ))}
              </WithTravelCardSkeleton>
            );
          })}
        </View>
      )}
    </View>
  );
}

function EmptyState() {
  const {t} = useTranslation();
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ThemedOnBehalfOf />
      <ThemeText typography="body__m__strong" type="secondary">
        {t(TicketingTexts.booking.cannotFindDepartures)}
      </ThemeText>
      <ThemeText typography="body__s" type="secondary">
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

const useBookingTripSelectionStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      gap: theme.spacing.medium,
    },
    travelCardsList: {
      gap: theme.spacing.small,
    },
  };
});
