import {Camera, CameraScreenContainer, PhotoFile} from '@atb/components/camera';
import {Ref, useEffect, useRef, useState} from 'react';
import {ImageConfirmationBottomSheet} from './ImageConfirmationBottomSheet';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {View} from 'react-native';
import {BottomSheetModalMethods} from '@atb/components/bottom-sheet';

type PhotoCaptureProps = {
  onConfirmImage: (file: PhotoFile) => void;
  onGoBack: () => void;
  title: string;
  secondaryText: string;
  isLoading?: boolean;
  focusRef?: Ref<any>;
  isFocused: boolean;
  errorMessage?: string;
};

export const PhotoCapture = ({
  onConfirmImage,
  onGoBack,
  title,
  secondaryText,
  isLoading = false,
  focusRef,
  isFocused,
  errorMessage,
}: PhotoCaptureProps) => {
  const {t} = useTranslation();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModalMethods | null>(null);
  const [file, setFile] = useState<PhotoFile | null>(null);

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
      errorMessage={errorMessage}
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
          file={file.path}
          onCloseFocusRef={onCloseFocusRef}
          bottomSheetModalRef={bottomSheetModalRef}
          heading={t(ParkingViolationTexts.imageConfirmation.title)}
          confirmText={t(ParkingViolationTexts.imageConfirmation.confirmButton)}
          dismissText={t(ParkingViolationTexts.imageConfirmation.retryButton)}
        />
      )}
    </CameraScreenContainer>
  );
};
