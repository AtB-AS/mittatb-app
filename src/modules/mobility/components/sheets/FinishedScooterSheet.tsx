import React from 'react';
import {dictionary, FareContractTexts, useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ShmoTripDetailsSectionItem} from '../ShmoTripDetailsSectionItem';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useShmoBookingQuery} from '../../queries/use-shmo-booking-query';
import {BottomSheetMap} from '@atb/components/bottom-sheet-map';
import {Close} from '@atb/assets/svg/mono-icons/actions';

type Props = {
  onClose: () => void;
  navigateSupportCallback: (operatorId: string, bookingId: string) => void;
  bookingId: string;
  positionArrowCallback: () => void;
};

export const FinishedScooterSheet = ({
  onClose,
  navigateSupportCallback,
  bookingId,
  positionArrowCallback,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {
    data: shmoBooking,
    isLoading,
    isError,
  } = useShmoBookingQuery(bookingId);
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  return (
    <BottomSheetMap
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      positionArrowCallback={positionArrowCallback}
    >
      {isShmoDeepIntegrationEnabled && (
        <>
          {isLoading && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {!isLoading && !isError && shmoBooking && (
            <>
              <View style={styles.footer}>
                <ScrollView style={styles.container}>
                  <Section>
                    <GenericSectionItem style={styles.finishingHeader}>
                      <ThemeText typography="body__primary--big--bold">
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
                </ScrollView>
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
    </BottomSheetMap>
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
