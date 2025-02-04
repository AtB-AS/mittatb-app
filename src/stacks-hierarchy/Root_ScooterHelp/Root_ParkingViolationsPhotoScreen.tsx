import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {Camera, PhotoFile} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ImageConfirmationBottomSheet} from './bottom-sheets/ImageConfirmationBottomSheet';
import {ScreenContainer} from './components/ScreenContainer';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useParkingViolations} from '@atb/parking-violations-reporting';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {RefObject, useRef} from 'react';

export type PhotoScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsPhotoScreen'>;

export const Root_ParkingViolationsPhotoScreen = ({
  navigation,
  route: {params},
}: PhotoScreenProps) => {
  const {t} = useTranslation();
  const isFocused = useIsFocusedAndActive();
  const style = useStyles();
  const {coordinates, isLoading} = useParkingViolations();
  const {open: openBottomSheet, close: closeBottomSheet} =
    useBottomSheetContext();
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const handlePhotoCapture = (file: PhotoFile) => {
    openBottomSheet(
      () => (
        <ImageConfirmationBottomSheet
          onConfirm={() => {
            closeBottomSheet();
            navigation.navigate('Root_ParkingViolationsQrScreen', {
              ...params,
              photo: file.path,
            });
          }}
          coordinates={coordinates}
          file={file}
        />
      ),
      onCloseFocusRef,
    );
  };

  return (
    <ScreenContainer
      leftHeaderButton={{type: 'back', withIcon: true}}
      title={t(ParkingViolationTexts.photo.title)}
      secondaryText={t(ParkingViolationTexts.photo.instruction)}
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
