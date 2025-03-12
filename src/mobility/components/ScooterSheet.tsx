import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useDoOnceOnItemReceived} from '../use-do-once-on-item-received';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {VehicleCard} from './VehicleCard';
import {ShmoActionButton} from './ShmoActionButton';
import {ShmoTripCard} from './ShmoTripCard';
import {ShmoBookingState} from '@atb/api/types/mobility';
import {ShmoTripDetailsSectionItem} from './ShmoTripDetailsSectionItem';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useRelevantVehicleData} from '../use-relevant-vehicle-data';

type Props = {
  vehicleId: VehicleId;
  onClose: () => void;
  onReportParkingViolation: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
  navigateSupportCallback: () => void;
  loginCallback: () => void;
  startOnboardingCallback: () => void;
  photoNavigation: (bookingId: string) => void;
};

export const ScooterSheet = ({
  vehicleId: id,
  onClose,
  onReportParkingViolation,
  onVehicleReceived,
  navigateSupportCallback,
  loginCallback,
  startOnboardingCallback,
  photoNavigation,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const {
    isLoading,
    isError,
    operatorId,
    operatorName,
    bookingId,
    activeBookingState,
    pricingPlan,
    appStoreUri,
    brandLogoUrl,
    rentalAppUri,
    currentFuelPercent,
    currentRangeMeters,
    totalAmount,
    departureTime,
    arrivalTime,
    vehicle,
    setCurrentBookingId,
  } = useRelevantVehicleData(id);

  const {operatorBenefit} = useOperatorBenefit(operatorId);

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  const {isParkingViolationsReportingEnabled, isShmoDeepIntegrationEnabled} =
    useFeatureTogglesContext();

  return (
    <BottomSheetContainer
      title={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      maxHeightValue={0.7}
      onClose={onClose}
    >
      <>
        {isLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading &&
          !isError &&
          activeBookingState !== ShmoBookingState.FINISHED && (
            <>
              <ScrollView style={styles.container}>
                {operatorBenefit && (
                  <OperatorBenefit
                    benefit={operatorBenefit}
                    formFactor={FormFactor.Scooter}
                    style={styles.operatorBenefit}
                  />
                )}

                {isShmoDeepIntegrationEnabled && bookingId && (
                  <ShmoTripCard
                    bookingId={bookingId}
                    departureTime={departureTime}
                  />
                )}
                <VehicleCard
                  pricingPlan={pricingPlan}
                  currentFuelPercent={currentFuelPercent}
                  currentRangeMeters={currentRangeMeters}
                  operatorName={operatorName}
                  brandLogoUrl={brandLogoUrl}
                />
              </ScrollView>
              <View style={styles.footer}>
                {isShmoDeepIntegrationEnabled ? (
                  /*mobilityOperators?.find((e) => e.id === operatorId)
                ?.isDeepIntegrationEnabled*/ <>
                    <ShmoActionButton
                      onLogin={loginCallback}
                      onStartOnboarding={startOnboardingCallback}
                      bookingId={bookingId}
                      vehicleId={id}
                      operatorId={operatorId ?? ''}
                      photoNavigation={photoNavigation}
                    />
                    <Button
                      expanded={true}
                      onPress={navigateSupportCallback}
                      text={t(MobilityTexts.helpText)}
                      mode="tertiary"
                      backgroundColor={theme.color.background.neutral[1]}
                    />
                  </>
                ) : (
                  <>
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
                        expanded={true}
                        style={styles.parkingViolationsButton}
                        text={t(MobilityTexts.reportParkingViolation)}
                        mode="secondary"
                        onPress={onReportParkingViolation}
                        rightIcon={{svg: ArrowRight}}
                        backgroundColor={theme.color.background.neutral[1]}
                      />
                    )}
                  </>
                )}
              </View>
            </>
          )}

        {activeBookingState === ShmoBookingState.FINISHED &&
          isShmoDeepIntegrationEnabled && (
            <View style={styles.footer}>
              <ScrollView style={styles.container}>
                <Section>
                  <GenericSectionItem style={styles.finishingHeader}>
                    <ThemeText typography="body__primary--big--bold">
                      {t(FareContractTexts.shmoDetails.tripEnded())}
                    </ThemeText>
                  </GenericSectionItem>

                  <ShmoTripDetailsSectionItem
                    startDateTime={departureTime ?? new Date()}
                    endDateTime={new Date(arrivalTime ?? '')}
                    totalAmount={totalAmount?.toString() ?? ''}
                    withHeader={true}
                  />
                </Section>
              </ScrollView>
              <Button
                mode="primary"
                active={false}
                interactiveColor={theme.color.interactive[0]}
                expanded={true}
                type="large"
                accessibilityRole="button"
                onPress={() => {
                  setCurrentBookingId(undefined);
                  onClose();
                }}
                text={t(MobilityTexts.trip.button.finishTrip)}
              />
              <Button
                expanded={true}
                onPress={navigateSupportCallback}
                text={t(MobilityTexts.helpText)}
                mode="tertiary"
                backgroundColor={theme.color.background.neutral[1]}
              />
            </View>
          )}
        {!isLoading && (isError || (!vehicle && !bookingId)) && (
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

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      marginBottom: theme.spacing.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
      marginHorizontal: theme.spacing.medium,
    },
    parkingViolationsButton: {
      marginTop: theme.spacing.medium,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
    finishingHeader: {
      alignItems: 'center',
    },
  };
});
