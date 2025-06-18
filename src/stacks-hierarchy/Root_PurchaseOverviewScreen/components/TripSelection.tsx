import {type PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {ActivityIndicator, View} from 'react-native';
import React from 'react';
import {MemoizedResultItem} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultItem';
import {useBookingTrips} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/use-booking-trips';
import type {TripPatternLegs} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/types';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {SectionSeparator} from '@atb/components/sections';
import {TripPatternWithBooking} from '@atb/api/types/trips';
import {Tag} from '@atb/components/tag';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {ThemedOnBehalfOf} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';

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
    enabled: true,
  });

  // Refetch in case the availability has changed
  useDoOnceWhen(reload, true, true);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isEmpty ? (
        tripPatterns.map((tp, i) => (
          <BookingTrip
            key={`booking-trip-${i}`}
            selection={selection}
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
  selection: PurchaseSelectionType;
  onSelect: (legs: TripPatternLegs) => void;
};

export function BookingTrip({
  tripPattern,
  selection,
  onSelect,
}: BookingTripProps) {
  const {theme} = useThemeContext();
  const styles = useBookingTripStyles();
  const {t} = useTranslation();

  const availableSeats = tripPattern.booking?.offer?.available ?? 0;

  const onPress = () => {
    onSelect(tripPattern.legs);
  };

  const isDisabled =
    tripPattern.booking.availability === 'closed' ||
    tripPattern.booking.availability === 'sold_out';

  return (
    <PressableOpacity
      disabled={tripPattern.booking.availability !== 'available'}
      onPress={onPress}
      style={[
        styles.container,
        styles.containerAvailable,
        isDisabled && styles.containerDisabled,
      ]}
    >
      <View style={styles.mainContent}>
        {tripPattern.booking.availability === 'closed' && (
          <Tag
            labels={[t(TicketingTexts.booking.closed)]}
            tagType="secondary"
          />
        )}
        {tripPattern.booking.availability === 'sold_out' && (
          <Tag labels={[t(TicketingTexts.booking.soldOut)]} tagType="warning" />
        )}
        <MemoizedResultItem
          tripPattern={tripPattern}
          key={tripPattern.compressedQuery}
          state={isDisabled ? 'disabled' : 'enabled'}
        />
      </View>
      {tripPattern.booking.availability === 'available' && (
        <>
          <SectionSeparator />
          <View
            style={[
              styles.footer,
              styles.footerDisabled,
              tripPattern.booking.availability === 'available' &&
                styles.footerAvailable,
            ]}
          >
            {!!availableSeats && availableSeats <= SEAT_TAG_LIMIT && (
              <Tag
                labels={[
                  t(TicketingTexts.booking.numAvailableTickets(availableSeats)),
                ]}
                tagType="info"
              />
            )}
            <Button
              text={t(TicketingTexts.booking.select)}
              expanded={false}
              type="small"
              mode="tertiary"
              onPress={onPress}
              backgroundColor={theme.color.interactive[2].default}
              style={{marginLeft: 'auto'}}
              rightIcon={{svg: ArrowRight}}
            />
          </View>
        </>
      )}
    </PressableOpacity>
  );
}

function EmptyState() {
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <ThemedOnBehalfOf />
      <ThemeText
        typography="body__primary--bold"
        color={theme.color.foreground.dynamic.secondary}
      >
        {t(TicketingTexts.booking.cannotFindDepartures)}
      </ThemeText>
      <ThemeText
        typography="body__secondary"
        color={theme.color.foreground.dynamic.secondary}
      >
        {t(TicketingTexts.booking.adjustTime)}
      </ThemeText>
    </View>
  );
}

const useBookingTripStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      borderRadius: theme.border.radius.regular,
    },
    containerAvailable: {
      backgroundColor: theme.color.interactive[2].default.background,
    },
    containerDisabled: {
      backgroundColor: theme.color.background.neutral[2].background,
    },
    mainContent: {
      padding: theme.spacing.medium,
      rowGap: theme.spacing.medium,
    },
    footer: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    footerAvailable: {
      backgroundColor: theme.color.interactive[2].default.background,
    },
    footerDisabled: {
      backgroundColor: theme.color.background.neutral[2].background,
    },
  };
});

const useBookingTripSelectionStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      width: '100%',
      rowGap: theme.spacing.medium,
      paddingVertical: theme.spacing.medium,
    },
  };
});
