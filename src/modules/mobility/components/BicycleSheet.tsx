import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {dictionary, useTranslation} from '@atb/translations';
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
import {MapBottomSheet} from '@atb/components/bottom-sheet-map';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {useOperators} from '../use-operators';

type Props = {
  vehicleId: VehicleId;
  onClose: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
  locationArrowOnPress: () => void;
};
export const BicycleSheet = ({
  vehicleId: id,
  onClose,
  onVehicleReceived,
  locationArrowOnPress,
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

  const operator = useOperators().byId(operatorId);

  return (
    <MapBottomSheet
      canMinimize={true}
      enablePanDownToClose={false}
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={operatorName}
      subText={t(MobilityTexts.formFactor(FormFactor.Bicycle))}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      logoUrl={brandLogoUrl}
      locationArrowOnPress={locationArrowOnPress}
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
                            svg={BicycleFill}
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
            </View>
            {rentalAppUri && (
              <View style={styles.footer}>
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  benefit={operatorBenefit}
                  appStoreUri={appStoreUri}
                  rentalAppUri={rentalAppUri}
                  rentalAppUriQueryParams={operator?.rentalAppUriQueryParams}
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
