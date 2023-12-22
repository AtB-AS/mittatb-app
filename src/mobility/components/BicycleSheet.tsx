import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {Battery, Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {MobilityStats} from '@atb/mobility/components//MobilityStats';
import {MobilityStat} from '@atb/mobility/components//MobilityStat';
import {BrandingImage} from '@atb/mobility/components/BrandingImage';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';

type Props = {
  vehicleId: VehicleId;
  close: () => void;
};
export const BicycleSheet = ({vehicleId: id, close}: Props) => {
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

  return (
    <BottomSheetContainer
      title={t(MobilityTexts.formFactor(FormFactor.Bicycle))}
      close={close}
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
                            svg={Battery}
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
                      fallback={<ThemedCityBike />}
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
          <View style={styles.errorMessage}>
            <MessageInfoBox
              type="error"
              message={t(ScooterTexts.loadingFailed)}
              onPressConfig={{
                action: close,
                text: t(ScreenHeaderTexts.headerButton.close.text),
              }}
            />
          </View>
        )}
      </>
    </BottomSheetContainer>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    container: {
      paddingHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
    content: {
      flexDirection: 'row',
      alignContent: 'center',
    },
    operatorBenefit: {
      marginBottom: theme.spacings.medium,
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
  };
});
