import {useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  ShmoBookingEvent,
  ShmoBookingEventType,
  ShmoBookingState,
} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '@atb/modules/mobility';
import {PhotoCapture} from '@atb/components/PhotoCapture';
import {PhotoFile} from '@atb/components/camera';
import {ActivityIndicator, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {MapStateActionType, useMapContext} from '@atb/modules/map';
import {compressImageToBase64} from '@atb/utils/image';
import {
  useCallback,
  // useEffect
} from 'react';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useQueryClient} from '@tanstack/react-query';
import {useAcceptLanguage} from '@atb/api/use-accept-language';
// eslint-disable-next-line no-restricted-imports
import {
  getActiveShmoBookingQueryKey,
  useActiveShmoBookingQuery,
} from '@atb/modules/mobility/queries/use-active-shmo-booking-query';
// eslint-disable-next-line no-restricted-imports
import {getShmoBookingQueryKey} from '@atb/modules/mobility/queries/use-shmo-booking-query';

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

  const {mutateAsync: sendShmoBookingEvent, isPending} =
    useSendShmoBookingEventMutation();

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
  const acceptLanguage = useAcceptLanguage();
  const queryClient = useQueryClient();
  const {data: activeShmoBookingData} = useActiveShmoBookingQuery(true);
  const onConfirmImage = async (photo: PhotoFile) => {
    if (activeShmoBookingData?.asset.systemId?.includes('voi')) {
      // temporary hack
      queryClient.setQueryData(
        getShmoBookingQueryKey(route.params.bookingId, acceptLanguage),
        {
          // ...queryClient.getQueryData(
          //   getActiveShmoBookingQueryKey(acceptLanguage),
          // ),
          ...activeShmoBookingData,
          state: ShmoBookingState.FINISHED,
          pricing: {
            currentAmount: activeShmoBookingData?.pricing.currentAmount,
            finalAmount: activeShmoBookingData?.pricing.currentAmount, // assume current becomes final
          },
        },
      );
      queryClient.invalidateQueries({
        queryKey: getActiveShmoBookingQueryKey(acceptLanguage),
      });
    } else {
      const compressedBase64Image = await compressImageToBase64(
        photo.path,
        1024,
        1024,
      );

      // Remove metadata
      const base64data = compressedBase64Image.split(',').pop();

      if (base64data) {
        await onEndTrip(route.params.bookingId, base64data);
      }
    }

    dispatchMapState({
      type: MapStateActionType.FinishedBooking,
      bookingId: route.params.bookingId,
    });

    onGoBack();
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('onConfirmImage settimeout');
  //     onConfirmImage();
  //   }, 3000);
  // }, []);

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

const useStyles = StyleSheet.createThemeHook((theme, {bottom}) => {
  return {
    activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
  };
});
