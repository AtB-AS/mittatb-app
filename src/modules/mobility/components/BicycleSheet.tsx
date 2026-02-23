import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {BatteryHigh} from '@atb/assets/svg/mono-icons/miscellaneous';
import {BicycleFill} from '@atb/assets/svg/mono-icons/transportation';
import {
  BicycleTexts,
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {PricingPlan} from './PricingPlan';
import {OperatorNameAndLogo} from './OperatorNameAndLogo';
import {formatRange} from '../utils';
import {useVehicle} from '../use-vehicle';
import {ActivityIndicator, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useOperatorBenefit} from '../use-operator-benefit';
import {OperatorActionButton} from './OperatorActionButton';
import {OperatorBenefit} from './OperatorBenefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {MobilityStats} from './MobilityStats';
import {MobilityStat} from './MobilityStat';
import {BrandingImage} from './BrandingImage';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {useDoOnceOnItemReceived} from '../use-do-once-on-item-received';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {TransportationIconBox} from '@atb/components/icon-box';

type Props = {
  vehicleId: VehicleId;
  onClose: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};
export const BicycleSheet = ({
  vehicleId: id,
  onClose,
  onVehicleReceived,
  locationArrowOnPress,
  navigateToScanQrCode,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useSheetStyle();
  const {
    vehicle,
    isLoading,
    isError,
    operatorId,
    operatorName,
    brandLogoUrl,
    rentalAppUri,
    appStoreUri,
  } = useVehicle(id);
  const {operatorBenefit} = useOperatorBenefit(operatorId);

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  return (
    <MapBottomSheet
      canMinimize={true}
      enablePanDownToClose={false}
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={t(MobilityTexts.formFactor(FormFactor.Bicycle))}
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
      <>
        {isLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !isError && vehicle && (
          <>
            <View style={styles.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  formFactor={FormFactor.Bicycle}
                  style={styles.operatorBenefit}
                />
              )}
              <Section>
                <GenericSectionItem>
                  <OperatorNameAndLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                    style={styles.operatorNameAndLogo}
                  />
                </GenericSectionItem>
                <GenericSectionItem>
                  <View style={styles.content}>
                    <MobilityStats
                      first={
                        (vehicle.vehicleType.propulsionType === 'ELECTRIC' ||
                          vehicle.vehicleType.propulsionType ===
                            'ELECTRIC_ASSIST') &&
                        vehicle.currentFuelPercent ? (
                          <MobilityStat
                            svg={BatteryHigh}
                            text={`**${vehicle.currentFuelPercent}%** ${t(
                              MobilityTexts.range(
                                formatRange(
                                  vehicle.currentRangeMeters,
                                  language,
                                ),
                              ),
                            )}`}
                          />
                        ) : (
                          <MobilityStat
                            svg={BicycleFill}
                            text={t(BicycleTexts.humanPoweredBike)}
                          />
                        )
                      }
                      second={
                        <PricingPlan
                          operator={operatorName}
                          plan={vehicle.pricingPlan}
                        />
                      }
                    />
                    <BrandingImage
                      logoUrl={brandLogoUrl}
                      fallback={<ThemedCityBike height={50} width={50} />}
                    />
                  </View>
                </GenericSectionItem>
              </Section>
            </View>
            {rentalAppUri && (
              <View style={styles.footer}>
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  appStoreUri={appStoreUri}
                  rentalAppUri={rentalAppUri}
                />
              </View>
            )}
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
      marginBottom: theme.spacing.medium,
    },
    content: {
      flexDirection: 'row',
      alignContent: 'center',
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
  };
});
