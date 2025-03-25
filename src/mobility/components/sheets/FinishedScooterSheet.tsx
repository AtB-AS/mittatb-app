import React from 'react';
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
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useActiveShmoBookingQuery} from '@atb/mobility/queries/use-active-shmo-booking-query';
import {
  ShmoBookingEvent,
  ShmoBookingEventType,
  ShmoBookingState,
} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '@atb/mobility/queries/use-send-shmo-booking-event-mutation';
import {ShmoTripDetailsSectionItem} from '../ShmoTripDetailsSectionItem';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

type Props = {
  onClose: () => void;
  navigateSupportCallback: () => void;
};

export const FinishedScooterSheet = ({
  onClose,
  navigateSupportCallback,
}: Props) => {
  const {data: activeBooking, isLoading, isError} = useActiveShmoBookingQuery();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  const {
    mutateAsync: sendShmoBookingEvent,
    isLoading: sendShmoBookingEventIsLoading,
  } = useSendShmoBookingEventMutation();

  const onEndTrip = async () => {
    if (activeBooking?.bookingId) {
      const finishEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.FINISH,
        fileName: 'scooterPhoto.png',
        fileType: 'image/png',
        fileData:
          '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',
      };
      const res = await sendShmoBookingEvent({
        bookingId: activeBooking?.bookingId,
        shmoBookingEvent: finishEvent,
      });

      if (res.state === ShmoBookingState.FINISHED) {
        onClose();
      }
    }
  };

  return (
    <BottomSheetScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {isShmoDeepIntegrationEnabled && (
        <>
          {isLoading && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {!isLoading && !isError && activeBooking && (
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
                      startDateTime={activeBooking.departureTime ?? new Date()}
                      endDateTime={new Date(activeBooking.arrivalTime ?? '')}
                      totalAmount={
                        activeBooking.pricing.finalAmount?.toString() ?? ''
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
                  loading={sendShmoBookingEventIsLoading}
                  type="large"
                  accessibilityRole="button"
                  onPress={onEndTrip}
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
            </>
          )}
          {!isLoading && (isError || !activeBooking) && (
            <View style={styles.footer}>
              <MessageInfoBox
                type="error"
                message={t(ScooterTexts.loadingFailed)}
              />
            </View>
          )}
        </>
      )}
    </BottomSheetScrollView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    container: {
      width: '100%',
    },
    contentContainer: {
      width: '100%',
      paddingBottom: Math.max(bottom, theme.spacing.medium),
    },
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
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
