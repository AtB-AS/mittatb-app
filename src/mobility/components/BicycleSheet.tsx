import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
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
import {MessageBox} from '@atb/components/message-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefitActionButton} from '@atb/mobility/components/OperatorBenefitActionButton';
import {OperatorAppSwitchButton} from '@atb/mobility/components/OperatorAppSwitchButton';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {MobilityStats} from '@atb/mobility/components//MobilityStats';
import {MobilityStat} from '@atb/mobility/components//MobilityStat';
import {CityBike} from '@atb/assets/svg/color/images/mobility';

type Props = {
  vehicleId: VehicleId;
  close: () => void;
};
export const BicycleSheet = ({vehicleId: id, close}: Props) => {
  const {t, language} = useTranslation();
  const style = useSheetStyle();
  const {
    vehicle,
    isLoading: isLoadingVehicle,
    isError: isLoadingError,
    operatorId,
    operatorName,
    brandLogoUrl,
    rentalAppUri,
    appStoreUri,
  } = useVehicle(id);
  const {
    operatorBenefit,
    valueCode,
    isUserEligibleForBenefit,
    isLoading: isLoadingBenefit,
    isError: isBenefitError,
  } = useOperatorBenefit(operatorId);

  const isLoading = isLoadingVehicle || isLoadingBenefit;
  const isError = isLoadingError || isBenefitError;

  return (
    <BottomSheetContainer maxHeightValue={0.5}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={t(MobilityTexts.formFactor(FormFactor.Bicycle))}
        color="background_1"
        setFocusOnLoad={false}
      />
      <>
        {isLoading && (
          <View style={style.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !isError && vehicle && (
          <>
            <ScrollView style={style.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  isUserEligible={isUserEligibleForBenefit}
                  formFactor={FormFactor.Bicycle}
                  style={style.operatorBenefit}
                />
              )}
              <Section>
                <GenericSectionItem>
                  <OperatorNameAndLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                  />
                </GenericSectionItem>
                <GenericSectionItem>
                  <View style={style.content}>
                    <MobilityStats
                      first={
                        (vehicle.vehicleType.propulsionType === 'ELECTRIC' ||
                          vehicle.vehicleType.propulsionType ===
                            'ELECTRIC_ASSIST') &&
                        vehicle.currentFuelPercent ? (
                          <MobilityStat
                            svg={Battery}
                            primaryStat={vehicle.currentFuelPercent + '%'}
                            secondaryStat={formatRange(
                              vehicle.currentRangeMeters,
                              language,
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
                    <OperatorNameAndLogo
                      operatorName={operatorName}
                      logoUrl={brandLogoUrl}
                      logoSize='large'
                      fallback={<CityBike />}
                    />
                  </View>
                </GenericSectionItem>
              </Section>
            </ScrollView>
            {rentalAppUri && (
              <View style={style.footer}>
                {operatorBenefit && isUserEligibleForBenefit ? (
                  <OperatorBenefitActionButton
                    benefit={operatorBenefit}
                    valueCode={valueCode}
                    operatorName={operatorName}
                    appStoreUri={appStoreUri}
                    rentalAppUri={rentalAppUri}
                  />
                ) : (
                  <OperatorAppSwitchButton
                    operatorName={operatorName}
                    appStoreUri={appStoreUri}
                    rentalAppUri={rentalAppUri}
                  />
                )}
              </View>
            )}
          </>
        )}
        {!isLoading && (isError || !vehicle) && (
          <View style={style.errorMessage}>
            <MessageBox
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
  };
});
