import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
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
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
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
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {Vehicle} from '@atb/api/types/mobility';
import {PriceDetailsCard} from '../PriceDetailsCard';
import {Loading} from '@atb/components/loading';
import {SupportButton} from '../SupportButton';

type Props = {
  selectPaymentMethod: () => void;
  vehicleId: VehicleId;
  onReportParkingViolation: () => void;
  onVehicleReceived?: (vehicle: Vehicle) => void;
  startOnboardingCallback: () => void;
  navigateToSupport: (params: ShmoHelpParams) => void;
  navigateToLogin: () => void;
};

export const ScooterSheet = ({
  selectPaymentMethod,
  vehicleId: id,
  onReportParkingViolation,
  onVehicleReceived,
  startOnboardingCallback,
  navigateToSupport,
  navigateToLogin,
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
    appStoreUri,
  } = useVehicle(id);

  const operator = useOperators().byId(operatorId);
  const operatorIsIntegrationEnabled = operator?.isDeepIntegrationEnabled;
  const priceAdjustments = operator?.priceAdjustments?.[FormFactor.Scooter];

  const {isLoading: shmoReqIsLoading, hasBlockers} =
    useShmoRequirements(operatorId);

  const {operatorBenefit} = useOperatorBenefit(operatorId);
  const selectedPaymentMethod = useSelectedShmoPaymentMethod();

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  const {isParkingViolationsReportingEnabled, isShmoDeepIntegrationEnabled} =
    useFeatureTogglesContext();

  return (
    <>
      {(isLoading || shmoReqIsLoading) && (
        <View
          style={styles.loading}
          accessibilityRole="progressbar"
          accessibilityLiveRegion="polite"
        >
          <Loading size="large" />
        </View>
      )}
      {!isLoading && (isError || !vehicle) && (
        <View style={styles.messageInfo}>
          <MessageInfoBox
            type="error"
            message={t(ScooterTexts.loadingFailed)}
          />
        </View>
      )}

      {!isLoading && !shmoReqIsLoading && !isError && vehicle && (
        <View style={styles.container}>
          {operatorBenefit && (
            <OperatorBenefit
              benefit={operatorBenefit}
              formFactor={FormFactor.Scooter}
              style={styles.operatorBenefit}
            />
          )}
          <View style={styles.vehicleContent}>
            <VehicleCard
              currentFuelPercent={vehicle.currentFuelPercent}
              currentRangeMeters={vehicle.currentRangeMeters}
              formFactor={vehicle.vehicleType.formFactor}
            />

            <PriceDetailsCard
              pricingPlan={vehicle.pricingPlan}
              priceAdjustments={priceAdjustments}
              systemId={vehicle.system.id}
            />
          </View>

          {isShmoDeepIntegrationEnabled &&
          operatorId &&
          operatorIsIntegrationEnabled ? (
            <>
              <ShmoActionButton
                onStartOnboarding={startOnboardingCallback}
                loginCallback={navigateToLogin}
                vehicleId={id}
                operatorId={operatorId}
                paymentMethod={selectedPaymentMethod}
                isStationBasedBooking={false}
              />
              <View style={styles.helpButtons}>
                {selectedPaymentMethod && !hasBlockers && (
                  <Section>
                    <PaymentSelectionSectionItem
                      paymentMethod={selectedPaymentMethod}
                      onPress={selectPaymentMethod}
                    />
                  </Section>
                )}

                <SupportButton
                  navigateToSupport={() => {
                    navigateToSupport({vehicleId: id, operatorId});
                  }}
                />
              </View>
            </>
          ) : (
            <>
              {rentalAppUri && (
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  appStoreUri={appStoreUri ?? ''}
                  rentalAppUri={rentalAppUri}
                />
              )}
              {isParkingViolationsReportingEnabled && (
                <Button
                  expanded={true}
                  text={t(MobilityTexts.reportParkingViolation)}
                  mode="secondary"
                  onPress={onReportParkingViolation}
                  rightIcon={{svg: ChevronRight}}
                  backgroundColor={theme.color.background.neutral[1]}
                />
              )}
            </>
          )}
        </View>
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: theme.spacing.medium,
      gap: theme.spacing.large,
    },
    vehicleContent: {
      gap: theme.spacing.small,
    },
    loading: {
      marginBottom: theme.spacing.medium,
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    messageInfo: {
      paddingBottom: theme.spacing.medium,
    },
    helpButtons: {
      gap: theme.spacing.medium,
    },
  };
});
