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
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ShmoTripDetailsSectionItem} from '../ShmoTripDetailsSectionItem';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useShmoBookingQuery} from '@atb/mobility/queries/use-shmo-booking-query';

type Props = {
  onClose: () => void;
  navigateSupportCallback: (operatorId: string, bookingId: string) => void;
  bookingId: string;
};

export const FinishedScooterSheet = ({
  onClose,
  navigateSupportCallback,
  bookingId,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {data: booking, isLoading, isError} = useShmoBookingQuery(bookingId);
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  return (
    <BottomSheetContainer
      title={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      maxHeightValue={0.7}
      onClose={onClose}
    >
      {isShmoDeepIntegrationEnabled && (
        <>
          {isLoading && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {!isLoading && !isError && booking && (
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
                      startDateTime={booking.departureTime ?? new Date()}
                      endDateTime={new Date(booking.arrivalTime ?? '')}
                      totalAmount={
                        booking.pricing.finalAmount?.toString() ?? ''
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
                      booking.operator.id,
                      booking.bookingId,
                    )
                  }
                  text={t(MobilityTexts.helpText)}
                  mode="secondary"
                  backgroundColor={theme.color.background.neutral[1]}
                />
              </View>
            </>
          )}
          {!isLoading && (isError || !booking) && (
            <View style={styles.footer}>
              <MessageInfoBox
                type="error"
                message={t(ScooterTexts.loadingFailed)}
              />
            </View>
          )}
        </>
      )}
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
    container: {
      marginBottom: theme.spacing.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
      marginHorizontal: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    finishingHeader: {
      alignItems: 'center',
    },
  };
});
