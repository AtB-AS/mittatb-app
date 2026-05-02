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
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {ShmoTripDetailsSectionItem} from '../ShmoTripDetailsSectionItem';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useShmoBookingQuery} from '../../queries/use-shmo-booking-query';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Loading} from '@atb/components/loading';
import {SupportButton} from '../SupportButton';

type Props = {
  onClose: () => void;
  navigateSupportCallback: (operatorId: string, bookingId: string) => void;
  bookingId: string;
};

export const FinishedShmoSheet = ({
  onClose,
  navigateSupportCallback,
  bookingId,
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
    <>
      {isShmoDeepIntegrationEnabled && (
        <>
          {isLoading && (
            <View style={styles.loading}>
              <Loading size="large" />
            </View>
          )}
          {!isLoading && !isError && shmoBooking && (
            <>
              <View style={styles.footer}>
                <View style={styles.container}>
                  <Section>
                    <GenericSectionItem>
                      <ThemeText typography="heading__m">
                        {t(FareContractTexts.shmoDetails.tripEnded())}
                      </ThemeText>
                    </GenericSectionItem>

                    <ShmoTripDetailsSectionItem
                      startDateTime={shmoBooking.departureTime ?? new Date()}
                      endDateTime={new Date(shmoBooking.arrivalTime ?? '')}
                      totalAmount={
                        shmoBooking.pricing.finalAmount?.toString() ?? ''
                      }
                      currency={shmoBooking?.pricingPlan.currency}
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

                <SupportButton
                  navigateToSupport={() => {
                    navigateSupportCallback(
                      shmoBooking.asset.operator.id,
                      shmoBooking.bookingId,
                    );
                  }}
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
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    loading: {
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
  };
});
