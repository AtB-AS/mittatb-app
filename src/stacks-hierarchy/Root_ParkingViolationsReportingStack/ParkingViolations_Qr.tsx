import {Camera} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';
import {Alert, Dimensions} from 'react-native';

export type QrScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Qr'>;

export const ParkingViolations_Qr = ({navigation}: QrScreenProps) => {
  const {t} = useTranslation();
  const style = useStyles();
  const isFocused = useIsFocused();
  const [hasCapturedQr, setHasCapturedQr] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setHasCapturedQr(false);
    }
  }, [isFocused]);

  const handlePhotoCapture = (qr: string) => {
    if (!hasCapturedQr) {
      setHasCapturedQr(true);
      console.log(qr);
      //navigation.navigate('ParkingViolations_Providers');
      Alert.alert(qr);
    }
  };

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.qr.title)}
      secondaryText={t(ParkingViolationTexts.qr.instructions)}
    >
      {isFocused && (
        <Camera mode="qr" style={style.camera} onCapture={handlePhotoCapture} />
      )}
    </ScreenContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  camera: {
    flexGrow: 1,
    marginVertical: theme.spacings.large,
    justifyContent: 'flex-start',
    // QR camera is always 4/3 aspect ratio but the QR code frame overlay is 100% height.
    // Setting the height and width explicitly prevents the overlay from overflowing
    // the camera view.
    height:
      (Dimensions.get('window').width - 2 * theme.spacings.medium) * 1.33333,
    width: Dimensions.get('window').width - 2 * theme.spacings.medium,
  },
}));
