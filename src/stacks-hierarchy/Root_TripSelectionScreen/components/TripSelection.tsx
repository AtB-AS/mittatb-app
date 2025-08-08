import {type PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {ActivityIndicator, View} from 'react-native';
import React from 'react';
import {MemoizedResultItem} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultItem';
import {useBookingTrips} from '@atb/modules/booking';
import type {TripPatternLegs} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/types';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {SectionSeparator} from '@atb/components/sections';
import {TripPatternWithBooking} from '@atb/api/types/trips';
import {Tag} from '@atb/components/tag';
import {ThemeText} from '@atb/components/text';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import {
  getTextForLanguage,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import {ThemedOnBehalfOf} from '@atb/theme/ThemedAssets';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {
  getMessageTypeForSituation,
  getSituationOrNoticeA11yLabel,
} from '@atb/modules/situations';
import {MessageInfoText} from '@atb/components/message-info-text';
import {findAllNotices, findAllSituations} from '@atb/modules/situations';

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
  const {theme} = useThemeContext();
  const styles = useBookingTripStyles();
  const {t, language} = useTranslation();

  const onPress = () => {
    onSelect(tripPattern.legs);
  };

  const isAvailable = tripPattern.booking.availability === 'available';

  const notices = findAllNotices(tripPattern);
  const situations = findAllSituations(tripPattern);

  return (
    <PressableOpacity
      disabled={tripPattern.booking.availability !== 'available'}
      onPress={onPress}
      style={[
        styles.container,
        isAvailable ? styles.containerAvailable : styles.containerDisabled,
      ]}
    >
      <View style={styles.mainContent}>
        <TripSelectionTag bookingInfo={tripPattern.booking} />
        <MemoizedResultItem
          tripPattern={tripPattern}
          key={tripPattern.compressedQuery}
          state={isAvailable ? 'enabled' : 'disabled'}
        />
        <View
          accessibilityLabel={getSituationOrNoticeA11yLabel(
            situations,
            notices,
            false,
            t,
          )}
        >
          {situations.map((situation) => (
            <MessageInfoText
              type={getMessageTypeForSituation(situation)}
              message={
                getTextForLanguage(situation.description, language) ?? ''
              }
            />
          ))}
          {notices.map((notice) => (
            <MessageInfoText
              type="info"
              message={notice.text ?? ''}
              key={notice.id}
            />
          ))}
        </View>
      </View>
      {isAvailable && (
        <>
          <SectionSeparator />
          <View
            style={[
              styles.footer,
              isAvailable ? styles.footerAvailable : styles.footerDisabled,
            ]}
          >
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

/**
 * We only want to show one tag at a time
 */
function TripSelectionTag({
  bookingInfo,
}: {
  bookingInfo: TripPatternWithBooking['booking'];
}) {
  const {t} = useTranslation();
  const availableSeats = bookingInfo?.offer?.available ?? 0;
  if (bookingInfo.availability === 'closed')
    return (
      <Tag labels={[t(TicketingTexts.booking.closed)]} tagType="warning" />
    );
  if (bookingInfo.availability === 'sold_out')
    return (
      <Tag labels={[t(TicketingTexts.booking.soldOut)]} tagType="warning" />
    );
  if (!!availableSeats && availableSeats <= SEAT_TAG_LIMIT)
    return (
      <Tag
        labels={[t(TicketingTexts.booking.numAvailableTickets(availableSeats))]}
        tagType="info"
      />
    );
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
    mainContent: {
      padding: theme.spacing.medium,
      rowGap: theme.spacing.medium,
    },
    footer: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.small,
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
    },
  };
});
