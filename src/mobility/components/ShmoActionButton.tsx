import {useAuthContext} from '@atb/auth';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React, {useCallback} from 'react';
import {useShmoRequirements} from '../use-shmo-requirements.tsx';
import {ButtonInfoTextCombo} from './ButtonInfoTextCombo.tsx';
import {InitShmoOneStopBookingRequestBody} from '@atb/api/types/mobility';
import {useInitShmoOneStopBookingMutation} from '../queries/use-init-shmo-one-stop-booking-mutation.tsx';
// this will be updated with new paymentcard component being created
// eslint-disable-next-line no-restricted-imports
import {usePreviousPaymentMethods} from '@atb/stacks-hierarchy/saved-payment-utils';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {formatErrorMessage} from '../utils.ts';

type ShmoActionButtonProps = {
  onLogin: () => void;
  onStartOnboarding: () => void;
  vehicleId: string;
  operatorId: string;
};

export const ShmoActionButton = ({
  onLogin,
  onStartOnboarding,
  vehicleId,
  operatorId,
}: ShmoActionButtonProps) => {
  const {authenticationType} = useAuthContext();
  const {hasBlockers, numberOfBlockers} = useShmoRequirements();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const {
    mutateAsync: initShmoOneStopBooking,
    isLoading: initShmoOneStopBookingIsLoading,
    isError: initShmoOneStopBookingIsError,
    error: initShmoOneStopBookingError,
  } = useInitShmoOneStopBookingMutation();

  const {recurringPaymentMethods} = usePreviousPaymentMethods();

  const initShmoBooking = useCallback(() => {
    if (
      vehicleId &&
      recurringPaymentMethods &&
      recurringPaymentMethods.length > 0
    ) {
      //TODO: This recurringPaymentId logic will be updated with new paymentcard component being created
      const lastRecurringPaymentMethod =
        recurringPaymentMethods[recurringPaymentMethods.length - 1];

      const recurringPaymentId =
        lastRecurringPaymentMethod.savedType === 'recurring'
          ? lastRecurringPaymentMethod?.recurringCard?.id
          : 0;
      const initReqBody: InitShmoOneStopBookingRequestBody = {
        recurringPaymentId: recurringPaymentId ?? 0,
        coordinates: {latitude: 0, longitude: 0},
        assetId: vehicleId,
        operatorId: operatorId,
      };
      initShmoOneStopBooking(initReqBody);
    }
  }, [initShmoOneStopBooking, vehicleId, operatorId, recurringPaymentMethods]);

  if (authenticationType != 'phone') {
    return (
      <ButtonInfoTextCombo
        onPress={onLogin}
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
      {initShmoOneStopBookingIsError && (
        <MessageInfoBox
          type="error"
          message={formatErrorMessage(initShmoOneStopBookingError, t)}
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
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    startTripWrapper: {
      gap: theme.spacing.medium,
    },
  };
});
