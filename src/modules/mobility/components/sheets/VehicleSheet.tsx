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
import {
  ActionButtonType,
  BonusOffer,
  ShmoPricingPlan,
  Vehicle,
} from '@atb/api/types/mobility';
import {PriceDetailsCard} from '../PriceDetailsCard';
import {Loading} from '@atb/components/loading';
import {SupportButton} from '../SupportButton';
import {TransportationIconBox} from '@atb/components/icon-box';
import {BrandingImage} from '../BrandingImage';
import {getTransportModeAndSubMode} from '../../utils';
import {
  BonusProductType,
  PayWithBonusPointsCheckbox,
  useIsBonusActiveForUser,
  useRelevantSharedMobilityBonusProduct,
} from '@atb/modules/bonus';
import {useAnalyticsContext} from '@atb/modules/analytics';
import type {BenefitType} from '@atb/api/types/benefit';
import {useAppSwitchMutation} from '../../queries/use-app-switch-mutation';
import {showAppMissingAlert} from '../../show-app-missing-alert';

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
  const {
    vehicle,
    isLoading,
    isError,
    operatorId,
    operatorName,
    rentalAppUri,
    appStoreUri,
  } = useMapVehicle();

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
  // Prefer the server-provided bonus offer; fall back to the client-side
  // lookup only when the vehicle response omits it.
  const clientBonusProduct =
    useRelevantSharedMobilityBonusProduct(vehicleTypeId);
  const serverBonusOffer = vehicle?.bonusOffer ?? undefined;
  const hasBonusOffer = !!serverBonusOffer || !!clientBonusProduct;
  const selectedBonusProductId =
    serverBonusOffer?.bonusProductId ?? clientBonusProduct?.id;
  const {logEvent} = useAnalyticsContext();
  const [payWithBonusPoints, setPayWithBonusPoints] = useState(false);

  const {
    mutateAsync: getAppSwitchUrl,
    isPending: isAppSwitchPending,
    isError: isAppSwitchError,
  } = useAppSwitchMutation();

  const actionButton = vehicle?.actionButton ?? undefined;

  const onAppSwitchPress = useCallback(async () => {
    if (!vehicleTypeId) return;
    const {url} = await getAppSwitchUrl({
      vehicleTypeId,
      bonusProductId: payWithBonusPoints ? selectedBonusProductId : undefined,
    });
    logEvent('Mobility', 'Open operator app', {
      operatorId,
      paidWithBonusPoints: payWithBonusPoints,
    });
    await Linking.openURL(url).catch(() =>
      showAppMissingAlert(operatorName, appStoreUri ?? undefined),
    );
  }, [
    vehicleTypeId,
    getAppSwitchUrl,
    payWithBonusPoints,
    selectedBonusProductId,
    logEvent,
    operatorId,
    operatorName,
    appStoreUri,
  ]);

  const isDeepIntegrationEnabled =
    isShmoDeepIntegrationEnabled &&
    (!isBicycle || isShmoDeepIntegrationCitybikeEnabled);
  const showVehicleCard = !isBicycle || isElectric;
  const showParkingViolation =
    !isBicycle && isParkingViolationsReportingEnabled;
  const showBonusCheckbox =
    !isBicycle && isBonusActiveForUser && hasBonusOffer && !!clientBonusProduct;

  // Drive the CTA from the server `actionButton` when present, otherwise fall
  // back to the existing deep-integration / operator branching.
  const showStartTrip = actionButton
    ? actionButton.type === ActionButtonType.START_TRIP
    : isDeepIntegrationEnabled &&
      !!operatorId &&
      !!operatorIsIntegrationEnabled;
  const showAppSwitchAction =
    actionButton?.type === ActionButtonType.APP_SWITCH;

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
              benefit={getDisplayedBenefit({
                payWithBonusPoints,
                vehicle,
                serverBonusOffer,
                clientBonusProduct,
              })}
              onNavigatePricingDetails={navigateToPricingDetails}
            />
          </View>

          {showStartTrip && operatorId ? (
            <>
              {showBonusCheckbox && clientBonusProduct && (
                <PayWithBonusPointsCheckbox
                  bonusProduct={clientBonusProduct}
                  operatorName={operatorName}
                  isChecked={payWithBonusPoints}
                  onPress={() => setPayWithBonusPoints((prev) => !prev)}
                />
              )}
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
          ) : showAppSwitchAction && rentalAppUri ? (
            <OperatorActionButton
              operatorId={operatorId}
              operatorName={operatorName}
              appStoreUri={appStoreUri ?? ''}
              rentalAppUri={rentalAppUri}
              appSwitchAction={{
                label:
                  getTextForLanguage(
                    actionButton?.type === ActionButtonType.APP_SWITCH
                      ? actionButton.label
                      : undefined,
                    language,
                  ) ?? t(MobilityTexts.operatorAppSwitchButton(operatorName)),
                onPress: onAppSwitchPress,
                isLoading: isAppSwitchPending,
                hasError: isAppSwitchError,
              }}
            />
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

/**
 * Resolves which benefit drives the price display. Benefit and bonus offer never
 * stack: the server benefit applies by default, and choosing to pay with bonus
 * points overrides it with the bonus offer's price adjustments. The server bonus
 * offer wins over the client-side product when both are present.
 */
const getDisplayedBenefit = ({
  payWithBonusPoints,
  vehicle,
  serverBonusOffer,
  clientBonusProduct,
}: {
  payWithBonusPoints: boolean;
  vehicle: Vehicle;
  serverBonusOffer: BonusOffer | undefined;
  clientBonusProduct: BonusProductType | undefined;
}): BenefitType | undefined => {
  if (!payWithBonusPoints) return vehicle.benefit ?? undefined;

  // The server-driven offer is already scoped to the vehicle's system. The
  // client-side product is the legacy fallback and still filters by system.
  const bonusPriceAdjustments = serverBonusOffer
    ? serverBonusOffer.priceAdjustments
    : (clientBonusProduct?.priceAdjustments
        ?.filter((pa) => pa.systemIds.includes(vehicle.system.id))
        .map((pa) => ({
          amount: pa.amount,
          type: pa.type,
          description: pa.description,
        })) ?? []);

  return {
    title: [],
    description: [],
    priceAdjustments: bonusPriceAdjustments,
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
  };
});
