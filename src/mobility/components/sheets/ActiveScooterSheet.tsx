import React, {useCallback} from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@atb/components/button';
import {useDoOnceOnItemReceived} from '../../use-do-once-on-item-received';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {VehicleCard} from '../VehicleCard';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {ShmoBookingEvent, ShmoBookingEventType} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '@atb/mobility/queries/use-send-shmo-booking-event-mutation';
import {ShmoTripCard} from '../ShmoTripCard';
import {formatErrorMessage} from '@atb/mobility/utils';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

type Props = {
  onActiveBookingReceived?: () => void;
  navigateSupportCallback: () => void;
};

export const ActiveScooterSheet = ({
  onActiveBookingReceived,
  navigateSupportCallback,
}: Props) => {
  const {data: activeBooking, isLoading, isError} = useActiveShmoBookingQuery();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  useDoOnceOnItemReceived(onActiveBookingReceived, activeBooking);

  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  const {
    mutateAsync: sendShmoBookingEvent,
    isLoading: sendShmoBookingEventIsLoading,
    isError: sendShmoBookingEventIsError,
    error: sendShmoBookingEventError,
  } = useSendShmoBookingEventMutation();

  const startFinishingShmoBooking = useCallback(async () => {
    if (activeBooking?.bookingId) {
      const startFinishingEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.START_FINISHING,
      };
      await sendShmoBookingEvent({
        bookingId: activeBooking.bookingId,
        shmoBookingEvent: startFinishingEvent,
      });
    }
  }, [activeBooking, sendShmoBookingEvent]);

  return (
    <BottomSheetScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {isShmoDeepIntegrationEnabled && (
        <>
          {isLoading && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {!isLoading && !isError && activeBooking && (
            <>
              <ScrollView style={styles.container}>
                <ShmoTripCard bookingId={activeBooking.bookingId} />
                <VehicleCard
                  pricingPlan={activeBooking.pricingPlan}
                  currentFuelPercent={activeBooking.asset.stateOfCharge ?? 0}
                  currentRangeMeters={
                    activeBooking.asset?.currentRangeKm
                      ? activeBooking.asset.currentRangeKm * 1000
                      : 0
                  }
                  operatorName={activeBooking.operator.name}
                />
              </ScrollView>
              <View style={styles.footer}>
                <View style={styles.endTripWrapper}>
                  {sendShmoBookingEventIsError && (
                    <MessageInfoBox
                      type="error"
                      message={formatErrorMessage(sendShmoBookingEventError, t)}
                    />
                  )}
                  <Button
                    mode="primary"
                    active={false}
                    disabled={sendShmoBookingEventIsLoading}
                    interactiveColor={theme.color.interactive.destructive}
                    expanded={true}
                    type="large"
                    accessibilityRole="button"
                    onPress={startFinishingShmoBooking}
                    loading={sendShmoBookingEventIsLoading}
                    text={
                      sendShmoBookingEventIsLoading
                        ? t(MobilityTexts.trip.button.endLoading)
                        : t(MobilityTexts.trip.button.end)
                    }
                  />
                </View>
                <Button
                  expanded={true}
                  onPress={navigateSupportCallback}
                  text={t(MobilityTexts.helpText)}
                  mode="secondary"
                  backgroundColor={theme.color.background.neutral[1]}
                />
              </View>
            </>
          )}
          {!isLoading && (isError || !activeBooking) && (
            <View style={styles.footer}>
              <MessageInfoBox
                type="error"
                message={t(ScooterTexts.loadingFailed)}
              />
            </View>
          )}
        </>
      )}
    </BottomSheetScrollView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      width: '100%',
    },
    contentContainer: {
      width: '100%',
      paddingBottom: Math.max(bottom, theme.spacing.medium),
    },
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
      marginHorizontal: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    endTripWrapper: {
      gap: theme.spacing.medium,
    },
  };
});
