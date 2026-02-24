import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useVehicle} from '../../use-vehicle';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useOperatorBenefit} from '../../use-operator-benefit';
import {OperatorBenefit} from '../OperatorBenefit';
import {OperatorActionButton} from '../OperatorActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useDoOnceOnItemReceived} from '../../use-do-once-on-item-received';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {VehicleCard} from '../VehicleCard';
import {ShmoActionButton} from '../ShmoActionButton';
import {useOperators} from '../../use-operators';
import {useShmoRequirements} from '../../use-shmo-requirements';
import {Section} from '@atb/components/sections';
import {
  PaymentSelectionSectionItem,
  useSelectedShmoPaymentMethod,
} from '@atb/modules/payment';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {Loading} from '@atb/components/loading';

type ScooterHelpParams = {operatorId: string} & (
  | {vehicleId: string}
  | {bookingId: string}
);

type Props = {
  selectPaymentMethod: () => void;
  vehicleId: VehicleId;
  onClose: () => void;
  onReportParkingViolation: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
  startOnboardingCallback: () => void;
  locationArrowOnPress: () => void;
  navigateToSupport: (params: ScooterHelpParams) => void;
  navigateToLogin: () => void;
  navigateToScanQrCode: () => void;
};

export const ScooterSheet = ({
  selectPaymentMethod,
  vehicleId: id,
  onClose,
  onReportParkingViolation,
  onVehicleReceived,
  startOnboardingCallback,
  locationArrowOnPress,
  navigateToSupport,
  navigateToLogin,
  navigateToScanQrCode,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {
    vehicle,
    isLoading,
    isError,
    operatorId,
    operatorName,
    rentalAppUri,
    brandLogoUrl,
    appStoreUri,
  } = useVehicle(id);

  const operator = useOperators().byId(operatorId);
  const operatorIsIntegrationEnabled = operator?.isDeepIntegrationEnabled;

  const {isLoading: shmoReqIsLoading, hasBlockers} =
    useShmoRequirements(operatorId);

  const {operatorBenefit} = useOperatorBenefit(operatorId);
  const selectedPaymentMethod = useSelectedShmoPaymentMethod();

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  const {isParkingViolationsReportingEnabled, isShmoDeepIntegrationEnabled} =
    useFeatureTogglesContext();

  return (
    <MapBottomSheet
      canMinimize={true}
      closeCallback={onClose}
      enablePanDownToClose={false}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={operatorName}
      subText={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      logoUrl={brandLogoUrl}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      {(isLoading || shmoReqIsLoading) && (
        <View
          style={styles.loading}
          accessibilityRole="progressbar"
          accessibilityLiveRegion="polite"
        >
          <Loading size="large" />
        </View>
      )}
      {!isLoading && !shmoReqIsLoading && !isError && vehicle && (
        <>
          <View style={styles.container}>
            {operatorBenefit && (
              <OperatorBenefit
                benefit={operatorBenefit}
                formFactor={FormFactor.Scooter}
                style={styles.operatorBenefit}
              />
            )}
            <View style={styles.vehicleCardWrapper}>
              <VehicleCard
                pricingPlan={vehicle.pricingPlan}
                currentFuelPercent={vehicle.currentFuelPercent}
                currentRangeMeters={vehicle.currentRangeMeters}
              />
            </View>

            {selectedPaymentMethod &&
              isShmoDeepIntegrationEnabled &&
              !hasBlockers &&
              operatorIsIntegrationEnabled && (
                <Section style={styles.paymentWrapper}>
                  <PaymentSelectionSectionItem
                    paymentMethod={selectedPaymentMethod}
                    onPress={selectPaymentMethod}
                  />
                </Section>
              )}
          </View>
          <View style={styles.footer}>
            {isShmoDeepIntegrationEnabled &&
            operatorId &&
            operatorIsIntegrationEnabled ? (
              <View style={styles.actionWrapper}>
                <ShmoActionButton
                  onStartOnboarding={startOnboardingCallback}
                  loginCallback={navigateToLogin}
                  vehicleId={id}
                  operatorId={operatorId}
                  paymentMethod={selectedPaymentMethod}
                />
                <Button
                  expanded={true}
                  onPress={() => {
                    navigateToSupport({vehicleId: id, operatorId});
                  }}
                  text={t(MobilityTexts.helpText)}
                  mode="secondary"
                  backgroundColor={theme.color.background.neutral[1]}
                />
              </View>
            ) : (
              <>
                {rentalAppUri && (
                  <OperatorActionButton
                    operatorId={operatorId}
                    operatorName={operatorName}
                    appStoreUri={appStoreUri}
                    rentalAppUri={rentalAppUri}
                  />
                )}
                {isParkingViolationsReportingEnabled && (
                  <Button
                    expanded={true}
                    style={styles.parkingViolationsButton}
                    text={t(MobilityTexts.reportParkingViolation)}
                    mode="secondary"
                    onPress={onReportParkingViolation}
                    rightIcon={{svg: ArrowRight}}
                    backgroundColor={theme.color.background.neutral[1]}
                  />
                )}
              </>
            )}
          </View>
        </>
      )}
      {!isLoading && (isError || !vehicle) && (
        <View style={styles.footer}>
          <MessageInfoBox
            type="error"
            message={t(ScooterTexts.loadingFailed)}
          />
        </View>
      )}
    </MapBottomSheet>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    loading: {
      marginBottom: theme.spacing.medium,
    },
    paymentWrapper: {
      marginBottom: theme.spacing.medium,
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      paddingHorizontal: theme.spacing.medium,
    },
    actionWrapper: {
      gap: theme.spacing.medium,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
    },
    parkingViolationsButton: {
      marginTop: theme.spacing.medium,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
    vehicleCardWrapper: {
      marginBottom: theme.spacing.medium,
    },
  };
});
