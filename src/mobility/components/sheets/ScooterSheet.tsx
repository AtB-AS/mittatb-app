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
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useDoOnceOnItemReceived} from '../../use-do-once-on-item-received';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {VehicleCard} from '../VehicleCard';
import {ShmoActionButton} from '../ShmoActionButton';
import {useOperators} from '../../use-operators';
import {useShmoRequirements} from '@atb/mobility/use-shmo-requirements';

type Props = {
  vehicleId: VehicleId;
  onClose: () => void;
  onReportParkingViolation: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
  navigateSupportCallback: () => void;
  loginCallback: () => void;
  startOnboardingCallback: () => void;
};

export const ScooterSheet = ({
  vehicleId: id,
  onClose,
  onReportParkingViolation,
  onVehicleReceived,
  navigateSupportCallback,
  loginCallback,
  startOnboardingCallback,
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

  const {isLoading: shmoReqIsLoading} = useShmoRequirements();

  const {operatorBenefit} = useOperatorBenefit(operatorId);

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);
  const {mobilityOperators} = useOperators();

  const {isParkingViolationsReportingEnabled, isShmoDeepIntegrationEnabled} =
    useFeatureTogglesContext();

  return (
    <BottomSheetContainer
      title={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      maxHeightValue={0.6}
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
            </ScrollView>
            <View style={styles.footer}>
              {isShmoDeepIntegrationEnabled &&
              operatorId &&
              mobilityOperators?.find((e) => e.id === operatorId)
                ?.isDeepIntegrationEnabled ? (
                <View style={styles.actionWrapper}>
                  <ShmoActionButton
                    onLogin={loginCallback}
                    onStartOnboarding={startOnboardingCallback}
                    vehicleId={id}
                    operatorId={operatorId}
                  />
                  <Button
                    expanded={true}
                    onPress={navigateSupportCallback}
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
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      marginBottom: theme.spacing.medium,
    },
    actionWrapper: {
      gap: theme.spacing.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
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
