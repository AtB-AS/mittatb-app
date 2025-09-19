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
import {Image} from 'react-native-compressor';
import {blobToBase64} from '@atb/modules/parking-violations-reporting';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';

export type ParkingPhotoScreenProps =
  RootStackScreenProps<'Root_ParkingPhotoScreen'>;

export const Root_ParkingPhotoScreen = ({
  navigation,
  route,
}: ParkingPhotoScreenProps) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {dispatchMapState} = useMapContext();

  const {mutateAsync: sendShmoBookingEvent, isLoading} =
    useSendShmoBookingEventMutation();

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
    const compressed = await Image.compress(photo.path, {
      maxHeight: 1024,
      maxWidth: 1024,
      quality: 0.7,
    });

    // Convert to Base64
    const image = await fetch(compressed);
    const imageBlob = await image.blob();
    const base64Image = await blobToBase64(imageBlob);
    // Remove metadata
    const base64data = base64Image.split(',').pop();

    if (base64data) {
      await onEndTrip(route.params.bookingId, base64data);
    }

    dispatchMapState({
      type: MapStateActionType.FinishedBooking,
      bookingId: route.params.bookingId,
    });

    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PhotoCapture
      onConfirmImage={onConfirmImage}
      title={t(MobilityTexts.photo.header)}
      secondaryText={t(MobilityTexts.photo.subHeader)}
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
