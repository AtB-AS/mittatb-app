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
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {PricingPlan} from '@atb/mobility/components/PricingPlan';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {
  formatRange,
  isBenefitOffered,
  isUserEligibleForBenefit,
} from '@atb/mobility/utils';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageBox} from '@atb/components/message-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useParkingViolationsReportingEnabled} from '@atb/parking-violations-reporting';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {OperatorBenefits} from '@atb/mobility/components/OperatorBenefits';
import {useBenefits} from '@atb/mobility/use-benefits';

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
    operatorId,
    error,
    operatorName,
    brandLogoUrl,
    rentalAppUri,
    appStoreUri,
  } = useVehicle(id);
  const {openOperatorApp} = useOperatorApp();
  const {
    userBenefits,
    operatorBenefits,
    isLoading: isLoadingBenefits,
  } = useBenefits(operatorId);
  const isLoading = isLoadingVehicle || isLoadingBenefits;

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
        color="background_1"
        setFocusOnLoad={false}
      />
      <>
        {isLoading && (
          <View style={style.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !error && vehicle && (
          <>
            <ScrollView style={style.container}>
              <OperatorBenefits entity={vehicle} style={style.benefits} />
              <Section>
                <GenericSectionItem>
                  <OperatorLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                  />
                </GenericSectionItem>
              </Section>
              <VehicleStats
                left={
                  <VehicleStat
                    svg={Battery}
                    primaryStat={vehicle.currentFuelPercent + '%'}
                    secondaryStat={formatRange(
                      vehicle.currentRangeMeters,
                      language,
                    )}
                  />
                }
                right={
                  <PricingPlan
                    operator={operatorName}
                    plan={vehicle.pricingPlan}
                    eligibleBenefits={
                      isBenefitOffered('free-unlock', operatorBenefits) &&
                      isUserEligibleForBenefit('free-unlock', userBenefits)
                        ? ['free-unlock']
                        : []
                    }
                  />
                }
              />
            </ScrollView>
            <View style={style.footer}>
              {rentalAppUri && (
                <Button
                  style={style.appSwitchButton}
                  text={t(MobilityTexts.operatorAppSwitchButton(operatorName))}
                  onPress={() =>
                    openOperatorApp({operatorName, appStoreUri, rentalAppUri})
                  }
                  mode="primary"
                  interactiveColor="interactive_0"
                />
              )}
              {isParkingViolationsReportingEnabled && (
                <Button
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
        {!isLoading && (error || !vehicle) && (
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
    benefits: {
      marginBottom: theme.spacings.medium,
    },
    container: {
      paddingHorizontal: theme.spacings.medium,
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    appSwitchButton: {
      marginBottom: theme.spacings.medium,
    },
  };
});
