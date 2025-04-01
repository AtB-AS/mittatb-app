import {useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ShmoBookingEvent, ShmoBookingEventType} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '@atb/mobility/queries/use-send-shmo-booking-event-mutation';
import {PhotoCapture} from '@atb/components/PhotoCapture';
import RNFS from 'react-native-fs';
import {PhotoFile} from '@atb/components/camera';
import {ActivityIndicator, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type ParkingPhotoScreenProps =
  RootStackScreenProps<'Root_ParkingPhotoScreen'>;

export const Root_ParkingPhotoScreen = ({
  navigation,
  route: {params},
}: ParkingPhotoScreenProps) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const {mutateAsync: sendShmoBookingEvent, isLoading} =
    useSendShmoBookingEventMutation();

  const onEndTrip = async (bookingId: string, fileData: string) => {
    if (bookingId) {
      const finishEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.FINISH,
        fileName: 'scooterPhoto.png',
        fileType: 'image/png',
        fileData: fileData,
      };
      await sendShmoBookingEvent({
        bookingId: bookingId,
        shmoBookingEvent: finishEvent,
      });
    }
  };

  const onConfirmImage = async (photo: PhotoFile) => {
    const base64Data = await RNFS.readFile(photo.path, 'base64');

    //TODO: Make sure we dont block the user from using map if request is slow, maybe set ActiveBooking null manually
    //Maybe entur needs to handle this better, send response afte a while automaticlly, so user isnt waiting
    await onEndTrip(params.bookingId, base64Data);

    navigation.replace('Root_TabNavigatorStack', {
      screen: 'TabNav_MapStack',
      params: {
        screen: 'Map_RootScreen',
        params: {
          showFinishedSheet: true,
          bookingId: params.bookingId,
        },
      },
    });
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
