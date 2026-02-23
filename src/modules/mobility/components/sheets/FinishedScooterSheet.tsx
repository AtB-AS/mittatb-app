import React from 'react';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ShmoTripDetailsSectionItem} from '../ShmoTripDetailsSectionItem';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useShmoBookingQuery} from '../../queries/use-shmo-booking-query';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Loading} from '@atb/components/loading';

type Props = {
  onClose: () => void;
  navigateSupportCallback: (operatorId: string, bookingId: string) => void;
  navigateToScanQrCode: () => void;
  bookingId: string;
  locationArrowOnPress: () => void;
};

export const FinishedScooterSheet = ({
  onClose,
  navigateSupportCallback,
  navigateToScanQrCode,
  bookingId,
  locationArrowOnPress,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const isFocusedAndActive = useIsFocusedAndActive();
  const {
    data: shmoBooking,
    isLoading,
    isError,
  } = useShmoBookingQuery(isFocusedAndActive, bookingId);
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  return (
    <MapBottomSheet
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      {isShmoDeepIntegrationEnabled && (
        <>
          {isLoading && (
            <View style={styles.activityIndicator}>
              <Loading size="large" />
            </View>
          )}
          {!isLoading && !isError && shmoBooking && (
            <>
              <View style={styles.footer}>
                <View style={styles.container}>
                  <Section>
                    <GenericSectionItem style={styles.finishingHeader}>
                      <ThemeText typography="heading__xl">
                        {t(FareContractTexts.shmoDetails.tripEnded())}
                      </ThemeText>
                    </GenericSectionItem>

                    <ShmoTripDetailsSectionItem
                      startDateTime={shmoBooking.departureTime ?? new Date()}
                      endDateTime={new Date(shmoBooking.arrivalTime ?? '')}
                      totalAmount={
                        shmoBooking.pricing.finalAmount?.toString() ?? ''
                      }
                      withHeader={true}
                    />
                  </Section>
                </View>
                <Button
                  mode="primary"
                  active={false}
                  interactiveColor={theme.color.interactive[0]}
                  expanded={true}
                  type="large"
                  accessibilityRole="button"
                  onPress={onClose}
                  text={t(MobilityTexts.trip.button.finishTrip)}
                />
                <Button
                  expanded={true}
                  onPress={() =>
                    navigateSupportCallback(
                      shmoBooking.asset.operator.id,
                      shmoBooking.bookingId,
                    )
                  }
                  text={t(MobilityTexts.helpText)}
                  mode="secondary"
                  backgroundColor={theme.color.background.neutral[1]}
                />
              </View>
            </>
          )}
          {!isLoading && (isError || !shmoBooking) && (
            <View style={styles.footer}>
              <MessageInfoBox
                type="error"
                message={t(ScooterTexts.loadingFailed)}
              />
            </View>
          )}
        </>
      )}
    </MapBottomSheet>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    activityIndicator: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      gap: theme.spacing.medium,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    finishingHeader: {
      alignItems: 'center',
    },
  };
});
