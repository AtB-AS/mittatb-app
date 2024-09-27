import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React, {useEffect} from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {useTranslation} from '@atb/translations';
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
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useParkingViolationsReportingEnabled} from '@atb/parking-violations-reporting';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {MobilityStats} from '@atb/mobility/components/MobilityStats';
import {MobilityStat} from '@atb/mobility/components/MobilityStat';
import {BrandingImage} from '@atb/mobility/components/BrandingImage';
import {ThemedScooter} from '@atb/theme/ThemedAssets';

type Props = {
  vehicleId: VehicleId;
  onClose: () => void;
  onReportParkingViolation: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
};
export const ScooterSheet = ({
  vehicleId: id,
  onClose,
  onReportParkingViolation,
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

  useEffect(() => {
    !!vehicle && !!onVehicleReceived && onVehicleReceived(vehicle);
  }, [vehicle, onVehicleReceived]);

  const [isParkingViolationsReportingEnabled] =
    useParkingViolationsReportingEnabled();

  return (
    <BottomSheetContainer
      title={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      maxHeightValue={0.5}
      onClose={onClose}
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
                      fallback={<ThemedScooter />}
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
                  onPress={onReportParkingViolation}
                  rightIcon={{svg: ArrowRight}}
                />
              )}
            </View>
          </>
        )}
        {!isLoading && (isError || !vehicle) && (
          <View style={styles.errorMessage}>
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
