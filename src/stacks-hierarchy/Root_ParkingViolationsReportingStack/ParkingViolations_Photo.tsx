import {Camera, PhotoFile} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useIsFocused} from '@react-navigation/native';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';

export type PhotoScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Photo'>;

export const ParkingViolations_Photo = ({navigation}: PhotoScreenProps) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const style = useStyles();

  const handlePhotoCapture = (file: PhotoFile) => {
    console.log(file);
    navigation.navigate('ParkingViolations_Qr');
  };

  return (
    <ScreenContainer title={t(ParkingViolationTexts.photo.title)}>
      {isFocused && (
        <Camera style={style.camera} onCapture={handlePhotoCapture}></Camera>
      )}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  camera: {
    flexGrow: 1,
  },
}));
