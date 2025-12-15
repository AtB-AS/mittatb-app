import {useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ShmoBookingEvent, ShmoBookingEventType} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '@atb/modules/mobility';
import {PhotoCapture} from '@atb/components/PhotoCapture';
import {PhotoFile} from '@atb/components/camera';
import {ActivityIndicator, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MapStateActionType, useMapContext} from '@atb/modules/map';
import {blobToBase64} from '@atb/modules/parking-violations-reporting';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {compressImage} from '@atb/utils/image';
import {useCallback} from 'react';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

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

  const {mutateAsync: sendShmoBookingEvent, isPending} =
    useSendShmoBookingEventMutation();

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {logEvent} = useBottomSheetContext();

  const onEndTrip = async (bookingId: string, fileData: string) => {
    if (bookingId) {
      const finishEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.FINISH,
        fileName: 'scooterPhoto.jpg',
        fileType: 'image/jpg',
        fileData: fileData,
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
    const compressedBlob = await compressImage(photo.path, 1024, 1024);
    if (!compressedBlob) return;

    // Convert to Base64
    const base64Image = await blobToBase64(compressedBlob);

    // Remove metadata
    const base64data = base64Image.split(',').pop();

    if (base64data) {
      await onEndTrip(route.params.bookingId, base64data);
    }

    dispatchMapState({
      type: MapStateActionType.FinishedBooking,
      bookingId: route.params.bookingId,
    });

    onGoBack();
  };

  if (isPending) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PhotoCapture
      onConfirmImage={onConfirmImage}
      onGoBack={onGoBack}
      title={t(MobilityTexts.photo.header)}
      secondaryText={t(MobilityTexts.photo.subHeader)}
      focusRef={focusRef}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
  };
});
