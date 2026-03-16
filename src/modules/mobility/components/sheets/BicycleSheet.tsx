import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
import React, {useState} from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  BicycleTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useVehicle} from '../../use-vehicle';
import {ActivityIndicator, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useOperatorBenefit} from '../../use-operator-benefit';
import {OperatorActionButton} from '../OperatorActionButton';
import {OperatorBenefit} from '../OperatorBenefit';
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
import {useDoOnceOnItemReceived} from '../../use-do-once-on-item-received';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {TransportationIconBox} from '@atb/components/icon-box';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  findRelevantBonusProduct,
  PayWithBonusPointsCheckbox,
} from '@atb/modules/bonus';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {Vehicle} from '@atb/api/types/mobility';
import {KnownProgramId, useIsEnrolled} from '@atb/modules/enrollment';
import {VehicleCard} from '../VehicleCard';
import {PriceDetailsCard} from '../PriceDetailsCard';
import {useOperators} from '../../use-operators';
import {useShmoRequirements} from '../../use-shmo-requirements';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {Button} from '@atb/components/button';
import {ShmoActionButton} from '../ShmoActionButton';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {
  PaymentSelectionSectionItem,
  useSelectedShmoPaymentMethod,
} from '@atb/modules/payment';
import {Section} from '@atb/components/sections';

type Props = {
  vehicleId: VehicleId;
  onClose: () => void;
  onVehicleReceived?: (vehicle: Vehicle) => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
  navigateToSupport: (params: ShmoHelpParams) => void;
  navigateToLogin: () => void;
  selectPaymentMethod: () => void;
};
export const BicycleSheet = ({
  vehicleId: id,
  onClose,
  onVehicleReceived,
  locationArrowOnPress,
  navigateToScanQrCode,
  navigateToSupport,
  navigateToLogin,
  selectPaymentMethod,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useSheetStyle();
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

  const {isLoading: shmoReqIsLoading, hasBlockers} =
    useShmoRequirements(operatorId);
  const selectedPaymentMethod = useSelectedShmoPaymentMethod();

  const {operatorBenefit} = useOperatorBenefit(operatorId);
  const [payWithBonusPoints, setPayWithBonusPoints] = useState(false);
  const {logEvent} = useAnalyticsContext();
  const isBonusEnabled = useIsEnrolled(KnownProgramId.BONUS);
  const {bonusProducts} = useFirestoreConfigurationContext();
  const bonusProduct = findRelevantBonusProduct(
    bonusProducts,
    operatorId,
    FormFactor.Bicycle,
  );

  const priceAdjustments = operator?.priceAdjustments?.[FormFactor.Bicycle];

  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  return (
    <MapBottomSheet
      canMinimize={true}
      enablePanDownToClose={false}
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={t(
        MobilityTexts.bikeNameByPropulsionType(
          vehicle?.vehicleType?.propulsionType,
        ),
      )}
      subText={operatorName}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      logoIcon={
        <TransportationIconBox
          mode="bicycle"
          isFlexible={false}
          size="normal"
          type="compact"
          overrideBorderRadius="50%"
        />
      }
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
        <View style={styles.footer}>
          <MessageInfoBox
            type="error"
            message={t(BicycleTexts.loadingFailed)}
          />
        </View>
      )}

      {!isLoading && !shmoReqIsLoading && !isError && vehicle && (
        <View style={styles.container}>
          {operatorBenefit && (
            <OperatorBenefit
              benefit={operatorBenefit}
              formFactor={FormFactor.Bicycle}
              style={styles.operatorBenefit}
            />
          )}
          <View style={styles.vehicleContent}>
            {vehicle.vehicleType.propulsionType ===
              (PropulsionType.ElectricAssist ||
                vehicle.vehicleType.propulsionType ===
                  PropulsionType.Electric) && (
              <VehicleCard
                currentFuelPercent={vehicle.currentFuelPercent}
                currentRangeMeters={vehicle.currentRangeMeters}
                formFactor={vehicle.vehicleType.formFactor}
              />
            )}

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
                onStartOnboarding={() => {}} // need to implement onboarding flow for bikes if we want to use this
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
                <View style={styles.footer}>
                  <OperatorActionButton
                    operatorId={operatorId}
                    operatorName={operatorName}
                    appStoreUri={appStoreUri ?? undefined}
                    rentalAppUri={rentalAppUri}
                    isBonusPayment={payWithBonusPoints}
                    setIsBonusPayment={setPayWithBonusPoints}
                    bonusProductId={bonusProduct?.id}
                  />
                </View>
              )}
              {isBonusEnabled && bonusProduct && (
                <PayWithBonusPointsCheckbox
                  bonusProduct={bonusProduct}
                  operatorName={operatorName}
                  isChecked={payWithBonusPoints}
                  onPress={() =>
                    setPayWithBonusPoints((payWithBonusPoints) => {
                      const newState = !payWithBonusPoints;
                      logEvent('Bonus', 'bonus points checkbox toggled', {
                        bonusProductId: bonusProduct.id,
                        newState: newState,
                      });
                      return newState;
                    })
                  }
                  style={styles.payWithBonusPointsSection}
                />
              )}
            </>
          )}
        </View>
      )}
    </MapBottomSheet>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    activityIndicator: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: theme.spacing.medium,
      gap: theme.spacing.large,
    },
    vehicleContent: {
      gap: theme.spacing.small,
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    messageInfo: {
      paddingBottom: theme.spacing.medium,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
    payWithBonusPointsSection: {
      marginTop: theme.spacing.medium,
    },
  };
});
