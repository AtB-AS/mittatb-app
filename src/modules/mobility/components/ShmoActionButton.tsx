import {useAuthContext} from '@atb/modules/auth';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React, {useCallback} from 'react';
import {useShmoRequirements} from '../use-shmo-requirements.tsx';
import {ButtonInfoTextCombo} from './ButtonInfoTextCombo.tsx';
import {InitShmoOneStopBookingRequestBody} from '@atb/api/types/mobility';
import {useInitShmoOneStopBookingMutation} from '../queries/use-init-shmo-one-stop-booking-mutation.tsx';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {formatFriendlyShmoErrorMessage} from '../utils.ts';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
import {PaymentMethod, savePreviousPayment} from '@atb/modules/payment';
import {useShmoWarnings} from '@atb/modules/map';
import {MessageInfoText} from '@atb/components/message-info-text';
import {AgeVerificationEnum} from '../queries/use-get-age-verification-query';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';

type ShmoActionButtonProps = {
  onStartOnboarding: () => void;
  loginCallback: () => void;
  vehicleId: string;
  operatorId: string;
  paymentMethod: PaymentMethod | undefined;
};

export const ShmoActionButton = ({
  onStartOnboarding,
  vehicleId,
  operatorId,
  paymentMethod,
  loginCallback,
}: ShmoActionButtonProps) => {
  const {authenticationType, userId} = useAuthContext();
  const {hasBlockers, numberOfBlockers, ageVerification, operatorAgeLimit} =
    useShmoRequirements(operatorId);
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const coordinates = getCurrentCoordinatesGlobal();
  const {warningMessage} = useShmoWarnings(vehicleId);
  const {logEvent} = useBottomSheetContext();

  const {
    mutateAsync: initShmoOneStopBooking,
    isPending: initShmoOneStopBookingIsLoading,
    isError: initShmoOneStopBookingIsError,
    error: initShmoOneStopBookingError,
  } = useInitShmoOneStopBookingMutation();

  const initShmoBooking = useCallback(async () => {
    const initReqBody: InitShmoOneStopBookingRequestBody = {
      recurringPaymentId: paymentMethod?.recurringPayment?.id ?? 0,
      coordinates: {
        latitude: coordinates?.latitude ?? 0,
        longitude: coordinates?.longitude ?? 0,
      },
      assetId: vehicleId ?? '',
      operatorId: operatorId,
    };
    const res = await initShmoOneStopBooking(initReqBody);
    logEvent('Mobility', 'Shmo booking started', {
      operatorId,
      bookingId: res.bookingId,
    });
    if (res.bookingId) {
      savePreviousPayment(
        userId,
        paymentMethod?.paymentType,
        paymentMethod?.recurringPayment?.id,
      );
    }
  }, [
    paymentMethod?.recurringPayment?.id,
    paymentMethod?.paymentType,
    coordinates?.latitude,
    coordinates?.longitude,
    vehicleId,
    operatorId,
    initShmoOneStopBooking,
    logEvent,
    userId,
  ]);

  if (authenticationType != 'phone') {
    return (
      <ButtonInfoTextCombo
        onPress={loginCallback}
        buttonText={t(MobilityTexts.shmoRequirements.loginBlocker)}
        message={t(MobilityTexts.shmoRequirements.loginBlockerInfoMessage)}
      />
    );
  }

  if (hasBlockers) {
    return (
      <ButtonInfoTextCombo
        onPress={onStartOnboarding}
        buttonText={t(MobilityTexts.shmoRequirements.shmoBlockers)}
        message={t(
          MobilityTexts.shmoRequirements.shmoBlockersInfoMessage(
            numberOfBlockers,
          ),
        )}
      />
    );
  }

  return (
    <View style={styles.startTripWrapper}>
      {warningMessage && (
        <MessageInfoText type="warning" message={warningMessage} />
      )}
      {initShmoOneStopBookingIsError && (
        <MessageInfoBox
          type="error"
          message={formatFriendlyShmoErrorMessage(
            initShmoOneStopBookingError,
            t,
          )}
        />
      )}
      {ageVerification === AgeVerificationEnum.UnderAge && (
        <MessageInfoBox
          type="warning"
          message={t(
            MobilityTexts.shmoRequirements.underAgeWarning(operatorAgeLimit),
          )}
        />
      )}
      <Button
        mode="primary"
        active={false}
        disabled={
          initShmoOneStopBookingIsLoading ||
          ageVerification !== AgeVerificationEnum.LegalAge
        }
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
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    startTripWrapper: {
      gap: theme.spacing.medium,
    },
  };
});
