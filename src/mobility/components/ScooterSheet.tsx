import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {Battery} from '@atb/assets/svg/mono-icons/vehicles';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {PricingPlan} from '@atb/mobility/components/PricingPlan';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {formatRange} from '@atb/mobility/utils';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ActivityIndicator, View} from 'react-native';
import {MessageBox} from '@atb/components/message-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useParkingViolationsReportingEnabled} from '@atb/parking-violations-reporting';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorBenefitActionButton} from '@atb/mobility/components/OperatorBenefitActionButton';
import {OperatorAppSwitchButton} from '@atb/mobility/components/OperatorAppSwitchButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Scooter} from '@atb/assets/svg/color/images/mobility';
import {MobilityStats} from '@atb/mobility/components/MobilityStats';
import {MobilityStat} from '@atb/mobility/components/MobilityStat';

type Props = {
  vehicleId: VehicleId;
  close: () => void;
  onReportParkingViolation: () => void;
};
export const ScooterSheet = ({
  vehicleId: id,
  close,
  onReportParkingViolation,
}: Props) => {
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

  const [isParkingViolationsReportingEnabled] =
    useParkingViolationsReportingEnabled();

  return (
    <BottomSheetContainer maxHeightValue={0.5}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={t(MobilityTexts.formFactor(FormFactor.Scooter))}
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
            <View style={style.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  isUserEligible={isUserEligibleForBenefit}
                  style={style.benefit}
                />
              )}
              <Section>
                <GenericSectionItem>
                  <OperatorLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                    maxHeight={20}
                    maxWidth={20}
                  />
                </GenericSectionItem>
                <GenericSectionItem>
                  <View style={style.content}>
                    <MobilityStats
                      top={
                        <MobilityStat
                          svg={Battery}
                          primaryStat={vehicle.currentFuelPercent + '%'}
                          secondaryStat={formatRange(
                            vehicle.currentRangeMeters,
                            language,
                          )}
                        />
                      }
                      bottom={
                        <PricingPlan
                          operator={operatorName}
                          plan={vehicle.pricingPlan}
                          eligibleBenefit={
                            operatorBenefit && isUserEligibleForBenefit
                              ? operatorBenefit.id
                              : undefined
                          }
                        />
                      }
                    />
                    {brandLogoUrl ? (
                      <OperatorLogo
                        operatorName={operatorName}
                        logoUrl={brandLogoUrl}
                      />
                    ) : (
                      <Scooter />
                    )}
                  </View>
                </GenericSectionItem>
              </Section>
            </View>
            <View style={style.footer}>
              {rentalAppUri &&
                (operatorBenefit && isUserEligibleForBenefit ? (
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
                ))}
              {isParkingViolationsReportingEnabled && (
                <Button
                  style={style.parkingViolationsButton}
                  text={t(MobilityTexts.reportParkingViolation)}
                  mode="secondary"
                  interactiveColor="interactive_2"
                  onPress={onReportParkingViolation}
                  rightIcon={{svg: ArrowRight}}
                />
              )}
            </View>
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
    benefit: {
      marginBottom: theme.spacings.medium,
    },
    container: {
      paddingHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
    content: {
      flexDirection: 'row',
      alignContent: 'center',
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    parkingViolationsButton: {
      marginTop: theme.spacings.medium,
    },
  };
});
