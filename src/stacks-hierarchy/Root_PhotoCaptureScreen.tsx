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

  const handlePhotoCapture = (file: PhotoFile) => {
    openBottomSheet(
      () => (
        <ImageConfirmationBottomSheet
          onConfirm={() => {
            closeBottomSheet();
            params.confirmImageCallback(file);
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
