import {dictionary, useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React, {useCallback, useState} from 'react';
import {Alert, View} from 'react-native';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  InitShmoOneStopBookingRequestBody,
  ShmoBookingEvent,
  ShmoBookingEventType,
  ShmoBookingState,
} from '@atb/api/types/mobility.ts';
import {useInitShmoOneStopBookingMutation} from '../queries/use-init-shmo-one-stop-booking-mutation.tsx';
import {useSendShmoBookingEventMutation} from '../queries/use-send-shmo-booking-event-mutation.tsx';
import {usePreviousPaymentMethods} from '@atb/stacks-hierarchy/saved-payment-utils.ts';
import {MessageInfoBox} from '@atb/components/message-info-box';

type ShmoTripProps = {
  bookingId?: string;
  vehicleId: string;
  operatorId: string;
  photoNavigation: (bookingId: string) => void;
};

export const ShmoTripButton = ({
  bookingId,
  vehicleId,
  operatorId,
  photoNavigation,
}: ShmoTripProps) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const hardCodedVehicleId = 'YRY:Vehicle:ea146030-7a7f-395b-b19b-874b9cccc12b';

  const {recurringPaymentMethods} = usePreviousPaymentMethods();

  const lastRecurringPaymentMethod =
    recurringPaymentMethods && recurringPaymentMethods.length > 0
      ? recurringPaymentMethods[recurringPaymentMethods.length - 1]
      : undefined;

  const recurringPaymentId =
    lastRecurringPaymentMethod?.savedType === 'recurring'
      ? lastRecurringPaymentMethod?.recurringCard?.id
      : '';

  const {
    mutateAsync: initShmoOneStopBooking,
    isLoading: initShmoOneStopBookingIsLoading,
    isError: initShmoOneStopBookingIsError,
    error: initShmoOneStopBookingError,
  } = useInitShmoOneStopBookingMutation();

  const {
    mutateAsync: sendShmoBookingEvent,
    isLoading: sendShmoBookingEventIsLoading,
    isError: sendShmoBookingEventIsError,
    error: sendShmoBookingEventError,
  } = useSendShmoBookingEventMutation();

  /*const onEndTrip = (file: PhotoFile) => {
    if (bookingId) {
      const finishEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.FINISH,
        fileName: 'scooterPhoto.png',
        fileType: 'image/png',
        fileData: file.path,
      };
      sendShmoBookingEvent({
        bookingId: bookingId,
        shmoBookingEvent: finishEvent,
      });
    }
  };*/

  const initShmoBooking = useCallback(() => {
    if (!!recurringPaymentId && !!vehicleId) {
      const initReqBody: InitShmoOneStopBookingRequestBody = {
        recurringPaymentId,
        coordinates: {latitude: 0, longitude: 0},
        //assetId: vehicleId,
        assetId: hardCodedVehicleId,
        operatorId: operatorId,
      };
      initShmoOneStopBooking(initReqBody);
    }
  }, [recurringPaymentId, initShmoOneStopBooking, vehicleId]);

  const startFinishingShmoBooking = useCallback(async () => {
    if (bookingId) {
      const startFinishingEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.START_FINISHING,
      };
      const res = await sendShmoBookingEvent({
        bookingId: bookingId,
        shmoBookingEvent: startFinishingEvent,
      });

      if (res.state === ShmoBookingState.FINISHING) {
        photoNavigation(bookingId);
      }
    }
  }, [bookingId, sendShmoBookingEvent]);

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

  if (!bookingId) {
    return (
      <View style={styles.startTripWrapper}>
        {initShmoOneStopBookingIsError && (
          <MessageInfoBox
            type="error"
            message={
              initShmoOneStopBookingError &&
              (initShmoOneStopBookingError as any).response.status === 500
                ? t(dictionary.genericErrorMsg)
                : (initShmoOneStopBookingError as any).response.data
            }
          />
        )}
        <Button
          mode="primary"
          active={false}
          disabled={initShmoOneStopBookingIsLoading}
          interactiveColor={theme.color.interactive[0]}
          expanded={true}
          type="large"
          accessibilityRole="button"
          onPress={initShmoBooking}
          loading={initShmoOneStopBookingIsLoading}
          text={
            initShmoOneStopBookingIsLoading
              ? t(MobilityTexts.trip.button.startLoading)
              : t(MobilityTexts.trip.button.start)
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.startTripWrapper}>
      {sendShmoBookingEventIsError && (
        <MessageInfoBox
          type="error"
          message={(sendShmoBookingEventError as any)?.response.data}
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
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    startTripWrapper: {
      gap: theme.spacing.medium,
    },
  };
});
