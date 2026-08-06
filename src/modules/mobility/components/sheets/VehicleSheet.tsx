import React, {useCallback, useState} from 'react';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useMapVehicle} from '../../use-map-vehicle';
import {Linking, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
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
import {
  ActionButtonType,
  BonusOffer,
  ShmoPricingPlan,
  Vehicle,
} from '@atb/api/types/mobility';
import {PriceDetailsCard} from '../PriceDetailsCard';
import {Loading} from '@atb/components/loading';
import {SupportButton} from '../SupportButton';
import {AppSwitchActionButton} from '@atb/modules/mobility';
import {TransportationIconBox} from '@atb/components/icon-box';
import {BrandingImage} from '../BrandingImage';
import {getTransportModeAndSubMode} from '../../utils';
import {
  PayWithBonusPointsCheckbox,
  useBonusProductById,
  useIsBonusActiveForUser,
} from '@atb/modules/bonus';
import {useAnalyticsContext} from '@atb/modules/analytics';
import type {BenefitType} from '@atb/api/types/benefit';
import {
  useVehicleAppSwitchMutation,
  VehicleAppSwitchVariables,
} from '../../queries/use-vehicle-app-switch-mutation';
import {showAppMissingAlert} from '../../show-app-missing-alert';
import {useMapContext} from '@atb/modules/map';

type Props = {
  selectPaymentMethod: () => void;
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
    benefit: BenefitType | undefined,
  ) => void;
};

export const VehicleSheet = ({
  selectPaymentMethod,
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
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {mapState} = useMapContext();

  const {
    vehicle,
    isLoading,
    isError,
    operatorId,
    operatorName,
    rentalAppUri,
    appStoreUri,
  } = useMapVehicle();

  const vehicleId = vehicle?.id;

  const formFactor = vehicle?.vehicleType.formFactor ?? FormFactor.Other;
  const propulsionType = vehicle?.vehicleType.propulsionType;
  const isBicycle =
    formFactor === FormFactor.Bicycle || formFactor === FormFactor.CargoBicycle;
  const isElectric =
    propulsionType === PropulsionType.Electric ||
    propulsionType === PropulsionType.ElectricAssist;

  const operator = useOperators().byId(operatorId);
  const operatorLogo = operator?.brandAssets?.brandImageUrl;

  const {mode, subMode} = getTransportModeAndSubMode(
    formFactor,
    propulsionType,
  );

  const {isLoading: shmoReqIsLoading, hasBlockers} = useShmoRequirements(
    operatorId,
    formFactor,
  );
  const selectedPaymentMethod = useSelectedShmoPaymentMethod();

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  const {isParkingViolationsReportingEnabled} = useFeatureTogglesContext();

  const isBonusActiveForUser = useIsBonusActiveForUser();
  const bonusOffer = vehicle?.bonusOffer ?? undefined;
  const selectedBonusProductId = bonusOffer?.bonusProductId;
  // The checkbox needs the full product (paymentDescription/productType), which
  // the server offer doesn't carry, so resolve it by id from active products.
  const bonusProduct = useBonusProductById(selectedBonusProductId);
  const {logEvent} = useAnalyticsContext();
  const [payWithBonusPoints, setPayWithBonusPoints] = useState(false);

  const {
    mutateAsync: getVehicleAppSwitch,
    isPending: isAppSwitchPending,
    isError: isAppSwitchError,
  } = useVehicleAppSwitchMutation();

  const actionButton = vehicle?.actionButton ?? undefined;

  const onAppSwitchPress = useCallback(async () => {
    const vehicleAppSwitchVariables: VehicleAppSwitchVariables = {
      vehicleId,
      vehicleTypeId: mapState.vehicleTypeId,
      stationId: mapState.stationId,
      bonusProductId: payWithBonusPoints ? selectedBonusProductId : undefined,
    };
    const vehicleAppSwitch = await getVehicleAppSwitch(
      vehicleAppSwitchVariables,
    );
    const logEventVariables = {
      operatorId,
      payWithBonusPoints,
      vehicleAppSwitchVariables,
    };
    if (vehicleAppSwitch === null) {
      logEvent('Mobility', 'Failed to open operator app', logEventVariables);
      return;
    }
    logEvent('Mobility', 'Open operator app', logEventVariables);
    await Linking.openURL(vehicleAppSwitch.url).catch(() =>
      showAppMissingAlert(operatorName, appStoreUri ?? undefined),
    );
  }, [
    vehicleId,
    mapState.vehicleTypeId,
    mapState.stationId,
    getVehicleAppSwitch,
    payWithBonusPoints,
    selectedBonusProductId,
    logEvent,
    operatorId,
    operatorName,
    appStoreUri,
  ]);

  const showVehicleCard = !isBicycle || isElectric;
  const showParkingViolation =
    !isBicycle && isParkingViolationsReportingEnabled;

  return (
    <MapBottomSheet
      canMinimize={true}
      closeCallback={onClose}
      enablePanDownToClose={false}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={
        vehicle
          ? t(MobilityTexts.vehicleName(formFactor, false, propulsionType))
          : undefined
      }
      subText={vehicle ? operatorName : undefined}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      logoIcon={
        !vehicle ? null : operatorLogo ? (
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
              benefit={getDisplayedBenefit({
                payWithBonusPoints,
                vehicle,
                bonusOffer,
              })}
              onNavigatePricingDetails={navigateToPricingDetails}
            />
          </View>

          {isBonusActiveForUser && !!bonusProduct && (
            <PayWithBonusPointsCheckbox
              bonusProduct={bonusProduct}
              operatorName={operatorName}
              isChecked={payWithBonusPoints}
              onPress={() => setPayWithBonusPoints((prev) => !prev)}
            />
          )}

          {actionButton?.type === ActionButtonType.START_TRIP && operatorId ? (
            <>
              <ShmoActionButton
                onStartOnboarding={() => startOnboardingCallback(formFactor)}
                loginCallback={navigateToLogin}
                vehicleId={vehicle.id}
                operatorId={operatorId}
                paymentMethod={selectedPaymentMethod}
                bonusProductId={
                  payWithBonusPoints ? selectedBonusProductId : undefined
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
                    navigateToSupport({
                      vehicleId: vehicle.id,
                      operatorId,
                      formFactor,
                    });
                  }}
                />
              </View>
            </>
          ) : (
            actionButton?.type === ActionButtonType.APP_SWITCH && (
              <View style={styles.appSwitchActionButtons}>
                {rentalAppUri && (
                  <AppSwitchActionButton
                    label={
                      getTextForLanguage(actionButton.label, language) ??
                      t(MobilityTexts.operatorAppSwitchButton(operatorName))
                    }
                    onPress={onAppSwitchPress}
                    isLoading={isAppSwitchPending}
                    hasError={isAppSwitchError}
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
              </View>
            )
          )}
        </View>
      )}
    </MapBottomSheet>
  );
};

/**
 * Resolves which benefit drives the price display. Benefit and bonus offer never
 * stack: the server benefit applies by default, and choosing to pay with bonus
 * points overrides it with the bonus offer's price adjustments.
 */
const getDisplayedBenefit = ({
  payWithBonusPoints,
  vehicle,
  bonusOffer,
}: {
  payWithBonusPoints: boolean;
  vehicle: Vehicle;
  bonusOffer: BonusOffer | undefined;
}): BenefitType | undefined => {
  if (!payWithBonusPoints) return vehicle.benefit ?? undefined;

  return {
    title: [],
    description: [],
    priceAdjustments: bonusOffer?.priceAdjustments ?? [],
  };
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
    appSwitchActionButtons: {
      gap: theme.spacing.medium,
    },
  };
});
