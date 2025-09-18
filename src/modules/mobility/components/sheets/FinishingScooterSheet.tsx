import React, {useCallback, useEffect} from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ActivityIndicator, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import {useActiveShmoBookingQuery} from '../../queries/use-active-shmo-booking-query';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {ThemeText} from '@atb/components/text';
import {ThemedBeacons} from '@atb/theme/ThemedAssets';
import {MapBottomSheet} from '@atb/components/bottom-sheet-map';
import {useAnalyticsContext} from '@atb/modules/analytics';

type Props = {
  photoNavigation: () => void;
  onForceClose: () => void;
  positionArrowCallback: () => void;
};

export const FinishingScooterSheet = ({
  onForceClose,
  photoNavigation,
  positionArrowCallback,
}: Props) => {
  const {
    data: activeBooking,
    isLoading,
    isError,
  } = useActiveShmoBookingQuery(ONE_SECOND_MS * 10);
  const {logEvent} = useAnalyticsContext();

  const {t} = useTranslation();
  const styles = useStyles();

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
    <MapBottomSheet
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      enablePanDownToClose={false}
      positionArrowCallback={positionArrowCallback}
    >
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
    </MapBottomSheet>
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
