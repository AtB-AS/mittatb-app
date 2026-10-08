import {useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ShmoBookingEvent, ShmoBookingEventType} from '@atb/api/types/mobility';
import {
  formatFriendlyShmoErrorMessage,
  useSendShmoBookingEventMutation,
  useShmoBookingQuery,
} from '@atb/modules/mobility';
import {PhotoCapture} from '@atb/components/PhotoCapture';
import {PhotoFile} from '@atb/components/camera';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {
  clearLastActiveBooking,
  MapStateActionType,
  useMapContext,
} from '@atb/modules/map';
import {compressImageToBase64} from '@atb/utils/image';
import {useCallback} from 'react';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {Loading} from '@atb/components/loading';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {useIsFocused} from '@react-navigation/native';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export type ParkingPhotoScreenProps =
  RootStackScreenProps<'Root_ParkingPhotoScreen'>;

export const Root_ParkingPhotoScreen = ({
  navigation,
  route,
}: ParkingPhotoScreenProps) => {
  const focusRef = useFocusOnLoad(navigation);
  const {t} = useTranslation();
  const styles = useStyles();
  const {dispatchMapState} = useMapContext();
  const {logEvent} = useAnalyticsContext();
  const isFocusedAndActive = useIsFocusedAndActive();
  const isFocused = useIsFocused();
  const {data: shmoBooking} = useShmoBookingQuery(
    isFocusedAndActive,
    route.params.bookingId,
  );

  const {
    mutateAsync: sendShmoBookingEvent,
    isPending,
    error: sendShmoBookingEventError,
  } = useSendShmoBookingEventMutation();

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onEndTrip = async (bookingId: string, fileData: string) => {
    if (bookingId) {
      const finishEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.FINISH,
        fileName: 'scooterPhoto.jpg',
        fileType: 'image/jpg',
        fileData: 'nefdjakfnajsnfsajn',
      };
      logEvent('Mobility', 'Shmo booking finished', {
        bookingId: bookingId,
      });
      return await sendShmoBookingEvent({
        bookingId: bookingId,
        shmoBookingEvent: finishEvent,
      });
    }
  };

  const onConfirmImage = async (photo: PhotoFile) => {
    const compressedBase64Image = await compressImageToBase64(
      photo.path,
      1024,
      1024,
    );

    // Remove metadata
    const base64data = compressedBase64Image.split(',').pop();

    if (base64data) {
      try {
        await onEndTrip(route.params.bookingId, base64data);
      } catch {
        // The trip is still running, so we stay on the camera with the message
        // from the failed event and let the user take a new photo and retry.
        return;
      }
    }

    // The receipt is shown right away here, so the booking disappearing from
    // the active booking query shouldn't open it a second time.
    clearLastActiveBooking();
    dispatchMapState({
      type: MapStateActionType.FinishedBooking,
      bookingId: route.params.bookingId,
    });

    onGoBack();
  };

  if (isPending) {
    return (
      <View style={styles.loading}>
        <Loading size="large" />
      </View>
    );
  }

  return (
    <PhotoCapture
      onConfirmImage={onConfirmImage}
      onGoBack={onGoBack}
      title={t(
        MobilityTexts.photo.header(
          shmoBooking?.asset?.formFactor ?? FormFactor.Other,
        ),
      )}
      secondaryText={t(MobilityTexts.photo.subHeader)}
      focusRef={focusRef}
      isFocused={isFocused}
      errorMessage={
        sendShmoBookingEventError
          ? formatFriendlyShmoErrorMessage(sendShmoBookingEventError, t)
          : undefined
      }
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme, {bottom}) => {
  return {
    loading: {
      flex: 1,
      justifyContent: 'center',
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
  };
});
