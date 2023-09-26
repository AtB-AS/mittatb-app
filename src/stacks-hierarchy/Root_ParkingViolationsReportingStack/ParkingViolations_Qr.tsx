import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ScreenContainer} from './ScreenContainer';
import {useTranslation} from '@atb/translations';
import {ParkingViolationsScreenProps} from './navigation-types';
import {Camera, PhotoFile} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useIsFocused} from '@react-navigation/native';

export type QrScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Qr'>;

export const ParkingViolations_Qr = () => {
  const {t} = useTranslation();
  const style = useStyles();
  const isFocused = useIsFocused();

  const handlePhotoCapture = (file: PhotoFile) => {
    console.log(file);
  };

  return (
    <ScreenContainer title={t(ParkingViolationTexts.qr.title)}>
      {isFocused && (
        <Camera style={style.camera} onCapture={handlePhotoCapture} />
      )}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  camera: {},
}));
