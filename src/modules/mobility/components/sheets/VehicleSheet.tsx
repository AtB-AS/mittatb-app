import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
import React, {useState} from 'react';
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
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
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
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {ShmoPricingPlan, Vehicle} from '@atb/api/types/mobility';
import {PriceDetailsCard} from '../PriceDetailsCard';
import {Loading} from '@atb/components/loading';
import {SupportButton} from '../SupportButton';
import {TransportationIconBox} from '@atb/components/icon-box';
import {BrandingImage} from '../BrandingImage';
import {getTransportModeAndSubMode} from '../../utils';
import {
  PayWithBonusPointsCheckbox,
  useIsBonusActiveForUser,
  useRelevantSharedMobilityBonusProduct,
} from '@atb/modules/bonus';
import type {MobilityPriceAdjustmentBenefitType} from '@atb/api/types/benefit';

type Props = {
  selectPaymentMethod: () => void;
  vehicleId: VehicleId;
  onClose: () => void;
  onReportParkingViolation: () => void;
  onVehicleReceived?: (vehicle: Vehicle) => void;
  startOnboardingCallback: (formFactor: FormFactor) => void;
  locationArrowOnPress: () => void;
  navigateToSupport: (params: ShmoHelpParams) => void;
  navigateToLogin: () => void;
  navigateToScanQrCode: () => void;
  navigateToPricingDetails: (
    pricingPlan: ShmoPricingPlan,
    benefit: MobilityPriceAdjustmentBenefitType | undefined,
  ) => void;
};

export const VehicleSheet = ({
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
  navigateToPricingDetails,
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

  const formFactor = vehicle?.vehicleType.formFactor ?? FormFactor.Other;
  const propulsionType = vehicle?.vehicleType.propulsionType;
  const isBicycle =
    formFactor === FormFactor.Bicycle || formFactor === FormFactor.CargoBicycle;
  const isElectric =
    propulsionType === PropulsionType.Electric ||
    propulsionType === PropulsionType.ElectricAssist;

  const operator = useOperators().byId(operatorId);
  const operatorIsIntegrationEnabled = operator?.isDeepIntegrationEnabled;
  const vehicleTypeId = vehicle?.vehicleType.id;
  const operatorLogo = operator?.brandAssets?.brandImageUrl;

  const {mode, subMode} = getTransportModeAndSubMode(
    formFactor,
    propulsionType,
  );

  const {isLoading: shmoReqIsLoading, hasBlockers} = useShmoRequirements(
    operatorId,
    formFactor,
  );

  const {operatorBenefit} = useOperatorBenefit(operatorId);
  const selectedPaymentMethod = useSelectedShmoPaymentMethod();

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  const {
    isParkingViolationsReportingEnabled,
    isShmoDeepIntegrationEnabled,
    isShmoDeepIntegrationCitybikeEnabled,
  } = useFeatureTogglesContext();

  const isBonusActiveForUser = useIsBonusActiveForUser();
  const bonusProduct = useRelevantSharedMobilityBonusProduct(vehicleTypeId);
  const [payWithBonusPoints, setPayWithBonusPoints] = useState(false);

  const isDeepIntegrationEnabled =
    isShmoDeepIntegrationEnabled &&
    (!isBicycle || isShmoDeepIntegrationCitybikeEnabled);
  const showVehicleCard = !isBicycle || isElectric;
  const showParkingViolation =
    !isBicycle && isParkingViolationsReportingEnabled;
  const showBonusCheckbox =
    !isBicycle && isBonusActiveForUser && !!bonusProduct;

  return (
    <MapBottomSheet
      canMinimize={true}
      closeCallback={onClose}
      enablePanDownToClose={false}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={t(MobilityTexts.vehicleName(formFactor, false, propulsionType))}
      subText={operatorName}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      logoIcon={
        operatorLogo ? (
          <BrandingImage logoUrl={operatorLogo} logoSize={28} rounded={true} />
        ) : (
          <TransportationIconBox mode={mode} subMode={subMode} rounded={true} />
        )
      }
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
              formFactor={formFactor}
            />
          )}
          <View style={styles.vehicleContent}>
            {showVehicleCard && (
              <VehicleCard
                currentFuelPercent={vehicle.currentFuelPercent}
                currentRangeMeters={vehicle.currentRangeMeters}
                formFactor={formFactor}
              />
            )}

            <PriceDetailsCard
              pricingPlan={vehicle.pricingPlan}
              benefit={
                payWithBonusPoints && bonusProduct?.priceAdjustments
                  ? ({
                      kind: 'MOBILITY_PRICE_ADJUSTMENT' as const,
                      vehicleTypeIds: vehicleTypeId ? [vehicleTypeId] : [],
                      systemIds: [vehicle.system.id],
                      priceAdjustments: bonusProduct.priceAdjustments.filter(
                        (pa) => pa.systemIds.includes(vehicle.system.id),
                      ),
                    } satisfies MobilityPriceAdjustmentBenefitType)
                  : (vehicle.benefit ?? undefined)
              }
              systemId={vehicle.system.id}
              onNavigatePricingDetails={navigateToPricingDetails}
            />
          </View>

          {isDeepIntegrationEnabled &&
          operatorId &&
          operatorIsIntegrationEnabled ? (
            <>
              {showBonusCheckbox && (
                <PayWithBonusPointsCheckbox
                  bonusProduct={bonusProduct}
                  operatorName={operatorName}
                  isChecked={payWithBonusPoints}
                  onPress={() => setPayWithBonusPoints((prev) => !prev)}
                />
              )}
              <ShmoActionButton
                onStartOnboarding={() => startOnboardingCallback(formFactor)}
                loginCallback={navigateToLogin}
                vehicleId={id}
                operatorId={operatorId}
                paymentMethod={selectedPaymentMethod}
                bonusProductId={
                  payWithBonusPoints ? bonusProduct?.id : undefined
                }
                formFactor={formFactor}
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
                    navigateToSupport({vehicleId: id, operatorId, formFactor});
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
              {showParkingViolation && (
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
    loading: {
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
