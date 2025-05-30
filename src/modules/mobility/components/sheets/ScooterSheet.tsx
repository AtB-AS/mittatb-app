import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useVehicle} from '../../use-vehicle';
import {ActivityIndicator, ScrollView, View} from 'react-native';
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
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {Section} from '@atb/components/sections';
import {
  PaymentSelectionSectionItem,
  useSelectedShmoPaymentMethod,
} from '@atb/modules/payment';

type Props = {
  selectPaymentMethod: () => void;
  vehicleId: VehicleId;
  onClose: () => void;
  onReportParkingViolation: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
  navigateSupportCallback: () => void;
  loginCallback: () => void;
  startOnboardingCallback: () => void;
  navigation: RootNavigationProps;
};

export const ScooterSheet = ({
  selectPaymentMethod,
  vehicleId: id,
  onClose,
  onReportParkingViolation,
  onVehicleReceived,
  navigateSupportCallback,
  loginCallback,
  startOnboardingCallback,
  navigation,
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

  const {mobilityOperators} = useOperators();
  const operatorIsIntegrationEnabled = mobilityOperators?.find(
    (e) => e.id === operatorId,
  )?.isDeepIntegrationEnabled;

  const {isLoading: shmoReqIsLoading, hasBlockers} = useShmoRequirements();
  const {operatorBenefit} = useOperatorBenefit(operatorId);
  const selectedPaymentMethod = useSelectedShmoPaymentMethod();

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  const {
    isParkingViolationsReportingEnabled,
    isShmoDeepIntegrationEnabled,
    isMapV2Enabled,
  } = useFeatureTogglesContext();

  return (
    <BottomSheetContainer
      title={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      maxHeightValue={0.7}
      onClose={onClose}
    >
      <>
        {(isLoading || shmoReqIsLoading) && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !shmoReqIsLoading && !isError && vehicle && (
          <>
            <ScrollView style={styles.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  formFactor={FormFactor.Scooter}
                  style={styles.operatorBenefit}
                />
              )}
              <VehicleCard
                pricingPlan={vehicle.pricingPlan}
                currentFuelPercent={vehicle.currentFuelPercent}
                currentRangeMeters={vehicle.currentRangeMeters}
                operatorName={operatorName}
                brandLogoUrl={brandLogoUrl}
              />
              {selectedPaymentMethod &&
                isShmoDeepIntegrationEnabled &&
                isMapV2Enabled &&
                !hasBlockers &&
                operatorIsIntegrationEnabled && (
                  <Section style={styles.paymentWrapper}>
                    <PaymentSelectionSectionItem
                      paymentMethod={selectedPaymentMethod}
                      onPress={selectPaymentMethod}
                    />
                  </Section>
                )}
            </ScrollView>
            <View style={styles.footer}>
              {isShmoDeepIntegrationEnabled &&
              isMapV2Enabled &&
              operatorId &&
              operatorIsIntegrationEnabled ? (
                <View style={styles.actionWrapper}>
                  <ShmoActionButton
                    onLogin={loginCallback}
                    onStartOnboarding={startOnboardingCallback}
                    vehicleId={id}
                    operatorId={operatorId}
                    paymentMethod={selectedPaymentMethod}
                  />
                  <Button
                    expanded={true}
                    onPress={() => {
                      navigateSupportCallback();
                      navigation.navigate('Root_ScooterHelpScreen', {
                        vehicleId: id,
                        operatorId,
                      });
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
                      benefit={operatorBenefit}
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
      </>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    activityIndicator: {
      marginBottom: theme.spacing.medium,
    },
    paymentWrapper: {
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      gap: theme.spacing.medium,
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
  };
});
