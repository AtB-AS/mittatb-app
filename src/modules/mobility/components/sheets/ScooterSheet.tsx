import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React, {useMemo, useState} from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useVehicle} from '../../use-vehicle';
import {ActivityIndicator, View} from 'react-native';
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
import {PriceDetailsCard} from '../PriceDetailsCard';
import {useMapContext} from '@atb/modules/map';

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
  const {headerHeight} = useMapContext();

  const priceAdjustments = operator?.priceAdjustments?.[FormFactor.Scooter];

  const {isLoading: shmoReqIsLoading, hasBlockers} =
    useShmoRequirements(operatorId);

  const {operatorBenefit} = useOperatorBenefit(operatorId);
  const selectedPaymentMethod = useSelectedShmoPaymentMethod();

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  const {isParkingViolationsReportingEnabled, isShmoDeepIntegrationEnabled} =
    useFeatureTogglesContext();

  const [height, setHeight] = useState<number | null>(null);
  const [actionButtonsHeight, setActionButtonsHeight] = useState<number | null>(
    null,
  );

  const snapPoints = useMemo(() => {
    if (
      height === null ||
      actionButtonsHeight === null ||
      headerHeight === null
    )
      return ['25%', '50%']; // fallback while measuring
    return [height + actionButtonsHeight + headerHeight - theme.spacing.medium];
  }, [height, actionButtonsHeight, headerHeight, theme.spacing.medium]);

  return (
    <MapBottomSheet
      canMinimize={true}
      snapPoints={
        isShmoDeepIntegrationEnabled &&
        operatorIsIntegrationEnabled &&
        !hasBlockers
          ? snapPoints
          : undefined
      }
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
          style={styles.activityIndicator}
          accessibilityRole="progressbar"
          accessibilityLiveRegion="polite"
        >
          <ActivityIndicator size="large" />
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
          <View
            onLayout={(e) => {
              setHeight(e.nativeEvent.layout.height);
            }}
          >
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
              />

              <PriceDetailsCard
                pricingPlan={vehicle.pricingPlan}
                priceAdjustments={priceAdjustments}
              />
            </View>
          </View>

          {isShmoDeepIntegrationEnabled &&
          operatorId &&
          operatorIsIntegrationEnabled ? (
            <>
              <View
                onLayout={(e) =>
                  setActionButtonsHeight(e.nativeEvent.layout.height)
                }
                style={{gap: theme.spacing.large}}
              >
                <ShmoActionButton
                  onStartOnboarding={startOnboardingCallback}
                  loginCallback={navigateToLogin}
                  vehicleId={id}
                  operatorId={operatorId}
                  paymentMethod={selectedPaymentMethod}
                />
                {selectedPaymentMethod && !hasBlockers && (
                  <Section>
                    <PaymentSelectionSectionItem
                      paymentMethod={selectedPaymentMethod}
                      onPress={selectPaymentMethod}
                    />
                  </Section>
                )}
              </View>
              <Button
                expanded={true}
                onPress={() => {
                  navigateToSupport({vehicleId: id, operatorId});
                }}
                text={t(MobilityTexts.helpText)}
                mode="secondary"
                backgroundColor={theme.color.background.neutral[1]}
              />
            </>
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
      )}
    </MapBottomSheet>
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
    activityIndicator: {
      marginBottom: theme.spacing.medium,
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    messageInfo: {
      paddingBottom: theme.spacing.medium,
    },
  };
});
