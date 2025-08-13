import React, {useCallback, useEffect} from 'react';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ActivityIndicator, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useActiveShmoBookingQuery} from '../../queries/use-active-shmo-booking-query';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {ThemeText} from '@atb/components/text';
import {ThemedBeacons} from '@atb/theme/ThemedAssets';

type Props = {
  photoNavigation: () => void;
  onForceClose: () => void;
};

export const FinishingScooterSheet = ({
  onForceClose,
  photoNavigation,
}: Props) => {
  const {
    data: activeBooking,
    isLoading,
    isError,
  } = useActiveShmoBookingQuery(ONE_SECOND_MS * 10);
  const {logEvent} = useBottomSheetContext();

  const {t} = useTranslation();
  const styles = useStyles();

  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  useEffect(() => {
    if (activeBooking === null) {
      onForceClose();
    }
  }, [activeBooking, onForceClose]);

  const startFinishingShmoBooking = useCallback(async () => {
    if (activeBooking?.bookingId) {
      logEvent('Mobility', 'Take a photo to end booking from mapscreen', {
        operatorId: activeBooking.asset.operator.id,
        bookingId: activeBooking.bookingId,
      });

      photoNavigation();
    }
  }, [
    activeBooking?.asset.operator.id,
    activeBooking?.bookingId,
    logEvent,
    photoNavigation,
  ]);

  return (
    <BottomSheetContainer maxHeightValue={0.7} disableHeader={true}>
      {isShmoDeepIntegrationEnabled && (
        <>
          {isLoading && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" />
            </View>
          )}
          {!isLoading && !isError && activeBooking && (
            <View style={styles.container}>
              <View style={styles.contentWrapper}>
                <ThemeText typography="heading--big">
                  {t(MobilityTexts.finishing.header)}
                </ThemeText>
                <View style={styles.illustrationWrapper}>
                  <ThemedBeacons height={102} />
                </View>
                <ThemeText>{t(MobilityTexts.finishing.p1)}</ThemeText>
                <ThemeText>{t(MobilityTexts.finishing.p2)}</ThemeText>
              </View>

              <Button
                mode="primary"
                active={false}
                expanded={true}
                type="large"
                accessibilityRole="button"
                onPress={startFinishingShmoBooking}
                text={t(MobilityTexts.finishing.button)}
              />
            </View>
          )}
          {!isLoading && (isError || !activeBooking) && (
            <View style={styles.container}>
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
  return {
    activityIndicator: {
      marginBottom: theme.spacing.medium,
    },
    container: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
      gap: theme.spacing.medium,
    },
    contentWrapper: {
      gap: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
      padding: theme.spacing.medium,
    },
    illustrationWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: theme.spacing.large,
    },
  };
});
