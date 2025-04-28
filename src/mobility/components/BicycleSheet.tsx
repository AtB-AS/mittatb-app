import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {BatteryHigh} from '@atb/assets/svg/mono-icons/miscellaneous';
import {Bicycle} from '@atb/assets/svg/mono-icons/transportation';
import {
  BicycleTexts,
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {PricingPlan} from '@atb/mobility/components/PricingPlan';
import {OperatorNameAndLogo} from '@atb/mobility/components/OperatorNameAndLogo';
import {formatRange} from '@atb/mobility/utils';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {MobilityStats} from '@atb/mobility/components//MobilityStats';
import {MobilityStat} from '@atb/mobility/components//MobilityStat';
import {BrandingImage} from '@atb/mobility/components/BrandingImage';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {useDoOnceOnItemReceived} from '../use-do-once-on-item-received';

type Props = {
  vehicleId: VehicleId;
  onClose: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
};
export const BicycleSheet = ({
  vehicleId: id,
  onClose,
  onVehicleReceived,
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
    <BottomSheetContainer
      title={t(MobilityTexts.formFactor(FormFactor.Bicycle))}
      onClose={onClose}
      maxHeightValue={0.5}
    >
      <>
        {isLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !isError && vehicle && (
          <>
            <ScrollView style={styles.container}>
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
                            primaryStat={vehicle.currentFuelPercent + '%'}
                            secondaryStat={t(
                              MobilityTexts.range(
                                formatRange(
                                  vehicle.currentRangeMeters,
                                  language,
                                ),
                              ),
                            )}
                          />
                        ) : (
                          <MobilityStat
                            svg={Bicycle}
                            primaryStat=""
                            secondaryStat={t(BicycleTexts.humanPoweredBike)}
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
            </ScrollView>
            {rentalAppUri && (
              <View style={styles.footer}>
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  benefit={operatorBenefit}
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
    </BottomSheetContainer>
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
