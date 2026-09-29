import {useAuthContext} from '@atb/modules/auth';
import {
  ForceUpdateTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React, {useCallback, useState} from 'react';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useShmoRequirements} from '../use-shmo-requirements.tsx';
import {ButtonInfoTextCombo} from './ButtonInfoTextCombo.tsx';
import {
  ActionButtonType,
  InitShmoOneStopBookingRequestBody,
  PreReqType,
} from '@atb/api/types/mobility';
import {useInitShmoOneStopBookingMutation} from '../queries/use-init-shmo-one-stop-booking-mutation.tsx';
import {Platform, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {formatFriendlyShmoErrorMessage} from '../utils.ts';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
import {PaymentMethod, savePreviousPayment} from '@atb/modules/payment';
import {useMapContext, useShmoWarnings} from '@atb/modules/map';
import {MessageInfoText} from '@atb/components/message-info-text';
import {AgeVerificationEnum} from '../queries/use-get-age-verification-query';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useMapVehicle} from '../use-map-vehicle.tsx';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {openUrl} from '@atb/utils/open-url';

type ShmoActionButtonProps = {
  onStartOnboarding: () => void;
  loginCallback: () => void;
  vehicleId: string;
  operatorId: string;
  paymentMethod: PaymentMethod | undefined;
  bonusProductId?: string;
  formFactor?: FormFactor;
};

export const ShmoActionButton = ({
  onStartOnboarding,
  vehicleId,
  operatorId,
  paymentMethod,
  loginCallback,
  bonusProductId,
  formFactor,
}: ShmoActionButtonProps) => {
  const {userId} = useAuthContext();
  const {mapState} = useMapContext();
  const {vehicle} = useMapVehicle();
  const preReqs =
    vehicle?.actionButton?.type === ActionButtonType.START_TRIP
      ? vehicle.actionButton.preReqs
      : undefined;
  const {
    requirements,
    hasBlockers,
    numberOfBlockers,
    ageVerification,
    operatorAgeLimit,
  } = useShmoRequirements(preReqs, formFactor);
  const ageVerificationRequired = requirements.some(
    (req) => req.requirementCode === PreReqType.AGE_VERIFICATION,
  );
  const appUpdateRequired = requirements.some(
    (req) => req.requirementCode === PreReqType.UNSUPPORTED,
  );
  const [openStoreLinkError, setOpenStoreLinkError] = useState(false);
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const coordinates = getCurrentCoordinatesGlobal();
  const {logEvent} = useAnalyticsContext();
  const {configurableLinks} = useFirestoreConfigurationContext();
  const {warningMessage} = useShmoWarnings(
    // Shmo warnings not yet supported for station based vehicles.
    mapState.isStationBasedBooking ? undefined : vehicleId,
  );
  const isLoggedInBlocking = requirements.find(
    (req) => req.requirementCode === PreReqType.IS_LOGGED_IN,
  )?.isBlocking;

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
      assetId: mapState.isStationBasedBooking ? undefined : vehicleId,
      stationId: mapState.isStationBasedBooking
        ? vehicle?.station?.id
        : undefined,
      operatorId: operatorId,
      vehicleTypeId: vehicle?.vehicleType.id,
      bonusProductId: bonusProductId,
    };
    const res = await initShmoOneStopBooking(initReqBody);
    logEvent('Mobility', 'Shmo booking started', {
      operatorId,
      bookingId: res.bookingId,
      paidWithBonusPoints: !!bonusProductId,
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
    mapState.isStationBasedBooking,
    vehicleId,
    vehicle?.station?.id,
    vehicle?.vehicleType.id,
    operatorId,
    initShmoOneStopBooking,
    logEvent,
    userId,
    bonusProductId,
  ]);

  if (appUpdateRequired) {
    return (
      <View style={styles.startTripWrapper}>
        <MessageInfoBox
          type="warning"
          message={t(
            MobilityTexts.shmoRequirements.appUpdateRequiredInfoMessage,
          )}
        />
        {openStoreLinkError && (
          <MessageInfoBox
            type="error"
            message={t(ForceUpdateTexts.errorMessage)}
          />
        )}
        <Button
          mode="primary"
          active={false}
          interactiveColor={theme.color.interactive[0]}
          expanded={true}
          type="large"
          accessibilityRole="button"
          onPress={() => {
            const link = Platform.select({
              ios: getTextForLanguage(
                configurableLinks?.iosStoreListing,
                language,
              ),
              android: getTextForLanguage(
                configurableLinks?.androidStoreListing,
                language,
              ),
              default: '',
            });
            setOpenStoreLinkError(false);
            openUrl(link, () => setOpenStoreLinkError(true));
          }}
          text={t(MobilityTexts.shmoRequirements.appUpdateRequired)}
        />
      </View>
    );
  }

  if (isLoggedInBlocking) {
    return (
      <ButtonInfoTextCombo
        onPress={loginCallback}
        buttonText={t(MobilityTexts.shmoRequirements.loginBlocker)}
        message={t(MobilityTexts.shmoRequirements.loginBlockerInfoMessage)}
      />
    );
  }

  if (hasBlockers && ageVerification !== AgeVerificationEnum.UnderAge) {
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
          (ageVerificationRequired &&
            ageVerification !== AgeVerificationEnum.LegalAge)
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
