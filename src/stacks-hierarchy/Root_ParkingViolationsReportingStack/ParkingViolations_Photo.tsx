import {useBottomSheet} from '@atb/components/bottom-sheet';
import {Camera, PhotoFile} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useIsFocused} from '@react-navigation/native';
import {ImageConfirmationBottomSheet} from './ImageConfirmationBottomSheet';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';
import {Dimensions} from 'react-native';

export type PhotoScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Photo'>;

export const ParkingViolations_Photo = ({
  navigation,
  route: {params},
}: PhotoScreenProps) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const style = useStyles();
  const {open: openBottomSheet, close: closeBottomSheet} = useBottomSheet();

  const handlePhotoCapture = (file: PhotoFile) => {
    openBottomSheet(() => (
      <ImageConfirmationBottomSheet
        onConfirm={() => {
          closeBottomSheet();
          navigation.navigate('ParkingViolations_Qr', {
            ...params,
            photo: file.path,
          });
        }}
        file={file}
        close={closeBottomSheet}
      />
    ));
  };

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.photo.title)}
      secondaryText={t(ParkingViolationTexts.photo.instruction)}
    >
      {isFocused && (
        <Camera
          mode="photo"
          style={style.camera}
          onCapture={handlePhotoCapture}
        ></Camera>
      )}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  camera: {
    flexGrow: 1,
    marginVertical: theme.spacings.large,
    height:
      (Dimensions.get('window').width - 2 * theme.spacings.medium) * (4 / 3),
    width: Dimensions.get('window').width - 2 * theme.spacings.medium,
  },
}));
