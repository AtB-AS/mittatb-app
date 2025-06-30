import React, {RefObject, useCallback, useEffect} from 'react';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ActivityIndicator, Alert, ScrollView, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {useDoOnceOnItemReceived} from '../../use-do-once-on-item-received';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {VehicleCard} from '../VehicleCard';
import {useActiveShmoBookingQuery} from '../../queries/use-active-shmo-booking-query';
import {
  ShmoBookingEvent,
  ShmoBookingEventType,
  ShmoBookingState,
} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '../../queries/use-send-shmo-booking-event-mutation';
import {ShmoTripCard} from '../ShmoTripCard';
import {formatFriendlyShmoErrorMessage} from '../../utils';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {MapView} from '@rnmapbox/maps';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useShmoWarnings} from '@atb/modules/map';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';

type Props = {
  onActiveBookingReceived?: () => void;
  navigateSupportCallback: () => void;
  photoNavigation: (bookingId: string) => void;
  onForceClose: () => void;
  mapViewRef: RefObject<MapView | null>;
};

export const ActiveScooterSheet = ({
  onActiveBookingReceived,
  navigateSupportCallback,
  photoNavigation,
  onForceClose,
  mapViewRef,
}: Props) => {
  useKeepAwake();
  const {
    data: activeBooking,
    isLoading,
    isError,
  } = useActiveShmoBookingQuery(ONE_SECOND_MS * 10);
  const {logEvent} = useBottomSheetContext();

  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {geofencingZoneMessage, warningMessage} = useShmoWarnings(
    activeBooking?.asset.id ?? '',
    mapViewRef,
  );

  useDoOnceOnItemReceived(onActiveBookingReceived, activeBooking);

  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  useEffect(() => {
    if (activeBooking === null) {
      onForceClose();
    }
  }, [activeBooking, onForceClose]);

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
      const res = await sendShmoBookingEvent({
        bookingId: activeBooking.bookingId,
        shmoBookingEvent: startFinishingEvent,
      });

      logEvent('Mobility', 'Shmo booking start finishing', {
        operatorId: activeBooking.asset.operator.id,
        bookingId: activeBooking.bookingId,
        finalAmount: res?.pricing?.finalAmount,
      });

      if (res?.state === ShmoBookingState.FINISHING) {
        photoNavigation(activeBooking?.bookingId);
      }
    }
  }, [
    activeBooking?.asset.operator.id,
    activeBooking?.bookingId,
    logEvent,
    photoNavigation,
    sendShmoBookingEvent,
  ]);

  const showEndAlert = async () => {
    Alert.alert(
      t(MobilityTexts.trip.button.end),
      t(MobilityTexts.trip.endAlert.header),

      [
        {
          text: t(MobilityTexts.trip.endAlert.continue),
          style: 'cancel',
        },
        {
          text: t(MobilityTexts.trip.endAlert.end),
          style: 'destructive',
          onPress: startFinishingShmoBooking,
        },
      ],
    );
  };

  return (
    <BottomSheetContainer maxHeightValue={0.7} disableHeader={true}>
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
                <ShmoTripCard shmoBooking={activeBooking} />
                <VehicleCard
                  pricingPlan={activeBooking.pricingPlan}
                  currentFuelPercent={activeBooking.asset.stateOfCharge ?? 0}
                  currentRangeMeters={
                    activeBooking.asset?.currentRangeKm
                      ? activeBooking.asset.currentRangeKm * 1000
                      : 0
                  }
                  operatorName={activeBooking.asset.operator.name}
                />
              </ScrollView>
              <View style={styles.footer}>
                <View style={styles.endTripWrapper}>
                  {geofencingZoneMessage && (
                    <MessageInfoText
                      type="warning"
                      message={geofencingZoneMessage}
                    />
                  )}
                  {warningMessage && (
                    <MessageInfoText type="warning" message={warningMessage} />
                  )}
                  {sendShmoBookingEventIsError && (
                    <MessageInfoBox
                      type="error"
                      message={formatFriendlyShmoErrorMessage(
                        sendShmoBookingEventError,
                        t,
                      )}
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
                    onPress={showEndAlert}
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
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    activityIndicator: {
      marginBottom: theme.spacing.medium,
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      gap: theme.spacing.medium,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    endTripWrapper: {
      gap: theme.spacing.medium,
    },
  };
});
