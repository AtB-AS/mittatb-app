import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {Camera, PhotoFile} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {RefObject, useRef} from 'react';
import {ScreenContainer} from './ScreenContainer';
import {ImageConfirmationBottomSheet} from './ImageConfirmationBottomSheet';
import {Coordinates} from '@atb/sdk';
import {useGeolocationContext} from '@atb/GeolocationContext';

type PhotoCaptureProps = {
  onConfirmImage: (file: PhotoFile) => void;
  coordinates?: Coordinates;
  title: string;
  secondaryText: string;
  isLoading?: boolean;
};

export const PhotoCapture = ({
  onConfirmImage,
  coordinates,
  title,
  secondaryText,
  isLoading = false,
}: PhotoCaptureProps) => {
  const isFocused = useIsFocusedAndActive();
  const style = useStyles();

  const {open: openBottomSheet, close: closeBottomSheet} =
    useBottomSheetContext();
  const onCloseFocusRef = useRef<RefObject<any>>(null);
  const {getCurrentCoordinates} = useGeolocationContext();

  const handlePhotoCapture = async (file: PhotoFile) => {
    //if there is no coordinates given, use the current user coordinates
    const userCoordinates = await getCurrentCoordinates();
    openBottomSheet(
      () => (
        <ImageConfirmationBottomSheet
          onConfirm={() => {
            closeBottomSheet();
            onConfirmImage(file);
          }}
          coordinates={coordinates ?? userCoordinates}
          file={file.path}
        />
      ),
      onCloseFocusRef,
    );
  };

  return (
    <ScreenContainer
      leftHeaderButton={{type: 'back', withIcon: true}}
      title={title}
      secondaryText={secondaryText}
      isLoading={isLoading}
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
