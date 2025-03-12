import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {Camera, PhotoFile} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {RefObject, useRef} from 'react';
import {ImageConfirmationBottomSheet} from './Root_ScooterHelp/bottom-sheets/ImageConfirmationBottomSheet';
import {ScreenContainer} from './Root_ScooterHelp/components/ScreenContainer';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {ShmoBookingEvent, ShmoBookingEventType} from '@atb/api/types/mobility';
import {useSendShmoBookingEventMutation} from '@atb/mobility/queries/use-send-shmo-booking-event-mutation';
export type PhotoScreenProps = RootStackScreenProps<'Root_PhotoCaptureScreen'>;

export const Root_PhotoCaptureScreen = ({
  navigation,
  route: {params},
}: PhotoScreenProps) => {
  const {t} = useTranslation();
  const isFocused = useIsFocusedAndActive();
  const style = useStyles();

  const {open: openBottomSheet, close: closeBottomSheet} =
    useBottomSheetContext();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const {mutateAsync: sendShmoBookingEvent} = useSendShmoBookingEventMutation();

  const onEndTrip = (bookingId: string) => {
    if (bookingId) {
      const finishEvent: ShmoBookingEvent = {
        event: ShmoBookingEventType.FINISH,
        fileName: 'scooterPhoto.png',
        fileType: 'image/png',
        fileData:
          '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',
      };
      sendShmoBookingEvent({
        bookingId: bookingId,
        shmoBookingEvent: finishEvent,
      });
    }
  };

  const handlePhotoCapture = (file: PhotoFile) => {
    openBottomSheet(
      () => (
        <ImageConfirmationBottomSheet
          onConfirm={() => {
            closeBottomSheet();
            onEndTrip(params.bookingId);
            navigation.goBack();
          }}
          coordinates={undefined}
          file={file}
        />
      ),
      onCloseFocusRef,
    );
  };

  return (
    <ScreenContainer
      leftHeaderButton={{type: 'back', withIcon: true}}
      title={t(MobilityTexts.photo.header)}
      secondaryText={t(MobilityTexts.photo.subHeader)}
    >
      {isFocused && (
        <Camera
          mode="photo"
          style={style.camera}
          onCapture={handlePhotoCapture}
          focusRef={onCloseFocusRef}
        />
      )}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  camera: {
    flexGrow: 1,
  },
}));
