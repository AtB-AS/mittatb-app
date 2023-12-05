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
import {OperatorNameAndLogo} from '@atb/mobility/components/OperatorNameAndLogo';
import {formatRange} from '@atb/mobility/utils';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageBox} from '@atb/components/message-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useParkingViolationsReportingEnabled} from '@atb/parking-violations-reporting';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Scooter} from '@atb/assets/svg/color/images/mobility';
import {MobilityStats} from '@atb/mobility/components/MobilityStats';
import {MobilityStat} from '@atb/mobility/components/MobilityStat';
import {BrandingImage} from '@atb/mobility/components/BrandingImage';

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
                  formFactor={FormFactor.Scooter}
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
                        <MobilityStat
                          svg={Battery}
                          primaryStat={vehicle.currentFuelPercent + '%'}
                          secondaryStat={t(
                            MobilityTexts.range(
                              formatRange(vehicle.currentRangeMeters, language),
                            ),
                          )}
                        />
                      }
                      second={
                        <PricingPlan
                          operator={operatorName}
                          plan={vehicle.pricingPlan}
                          benefit={operatorBenefit}
                        />
                      }
                    />
                    <BrandingImage
                      logoUrl={brandLogoUrl}
                      fallback={<Scooter />}
                    />
                  </View>
                </GenericSectionItem>
              </Section>
            </ScrollView>
            <View style={styles.footer}>
              {rentalAppUri && (
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  benefit={operatorBenefit}
                  appStoreUri={appStoreUri}
                  rentalAppUri={rentalAppUri}
                />
              )}
              {isParkingViolationsReportingEnabled && (
                <Button
                  style={styles.parkingViolationsButton}
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
          <View style={styles.errorMessage}>
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
    operatorBenefit: {
      marginBottom: theme.spacings.medium,
    },
    container: {
      paddingHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
  };
});
