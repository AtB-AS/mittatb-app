import {Camera, CameraScreenContainer, PhotoFile} from '@atb/components/camera';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {useRef, useState} from 'react';
import {ImageConfirmationBottomSheet} from './ImageConfirmationBottomSheet';
import {Coordinates} from '@atb/utils/coordinates';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
import {View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

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

  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const [file, setFile] = useState<PhotoFile | null>(null);
  const userCoordinates = getCurrentCoordinatesGlobal();

  const handlePhotoCapture = async (file: PhotoFile) => {
    setFile(file);
    bottomSheetModalRef.current?.present();
  };
  return (
    <CameraScreenContainer
      title={title}
      secondaryText={secondaryText}
      isLoading={isLoading}
    >
      {isFocused && (
        <>
          <Camera
            mode="photo"
            onCapture={handlePhotoCapture}
            focusRef={onCloseFocusRef}
          />
        </>
      )}
      {file && (
        <ImageConfirmationBottomSheet
          onConfirm={() => {
            bottomSheetModalRef.current?.dismiss();
            onConfirmImage(file);
          }}
          coordinates={coordinates ?? userCoordinates}
          file={file.path}
          onCloseFocusRef={onCloseFocusRef}
          bottomSheetModalRef={bottomSheetModalRef}
        />
      )}
    </CameraScreenContainer>
  );
};
