import {Camera, PhotoFile} from '@atb/components/camera';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';
import {useIsFocused} from '@react-navigation/native';

export type PhotoScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Photo'>;

export const ParkingViolations_Photo = ({navigation}: PhotoScreenProps) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();

  const handlePhotoCapture = (file: PhotoFile) => {
    console.log(file);
    navigation.navigate('ParkingViolations_Qr');
  };

  return (
    <ScreenContainer title={t(ParkingViolationTexts.photo.title)}>
      {isFocused && <Camera onCapture={handlePhotoCapture} />}
    </ScreenContainer>
  );
};
