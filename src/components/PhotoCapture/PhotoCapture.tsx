import {Camera, CameraScreenContainer, PhotoFile} from '@atb/components/camera';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Ref, useEffect, useRef, useState} from 'react';
import {ImageConfirmationBottomSheet} from './ImageConfirmationBottomSheet';
import {Coordinates} from '@atb/utils/coordinates';
import {getCurrentCoordinatesGlobal} from '@atb/modules/geolocation';
import {View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

type PhotoCaptureProps = {
  onConfirmImage: (file: PhotoFile) => void;
  onGoBack: () => void;
  coordinates?: Coordinates;
  title: string;
  secondaryText: string;
  isLoading?: boolean;
  focusRef?: Ref<any>;
};

export const PhotoCapture = ({
  onConfirmImage,
  onGoBack,
  coordinates,
  title,
  secondaryText,
  isLoading = false,
  focusRef,
}: PhotoCaptureProps) => {
  const isFocused = useIsFocusedAndActive();

  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const [file, setFile] = useState<PhotoFile | null>(null);
  const userCoordinates = getCurrentCoordinatesGlobal();

  const handlePhotoCapture = async (file: PhotoFile) => {
    setFile(file);
  };

  useEffect(() => {
    if (file && bottomSheetModalRef?.current) {
      bottomSheetModalRef.current.present();
    }
  }, [file]);

  return (
    <CameraScreenContainer
      title={title}
      secondaryText={secondaryText}
      isLoading={isLoading}
      onGoBack={onGoBack}
      focusRef={focusRef}
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
