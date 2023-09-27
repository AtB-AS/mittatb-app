import {Camera} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useIsFocused} from '@react-navigation/native';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';
import {useState} from 'react';

export type QrScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Qr'>;

export const ParkingViolations_Qr = ({navigation}: QrScreenProps) => {
  const {t} = useTranslation();
  const style = useStyles();
  const isFocused = useIsFocused();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);

  const handlePhotoCapture = (qr: string) => {
    if (!hasCapturedQr) {
      setHasCapturedQr(true);
      console.log(qr);
      navigation.navigate('ParkingViolations_Providers');
    }
  };

  return (
    <ScreenContainer title={t(ParkingViolationTexts.qr.title)}>
      {isFocused && (
        <Camera mode="qr" style={style.camera} onCapture={handlePhotoCapture} />
      )}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  camera: {
    flexGrow: 1,
  },
}));
