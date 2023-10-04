import {Camera, PhotoFile} from '@atb/components/camera';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useIsFocused} from '@react-navigation/native';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';
import {ThemeText} from '@atb/components/text';
import {themeColor} from './Root_ParkingViolationsReportingStack';

export type PhotoScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Photo'>;

export const ParkingViolations_Photo = ({
  navigation,
  route: {params},
}: PhotoScreenProps) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const style = useStyles();
  const {selectedViolations} = params;
  console.log(
    'selectedViolations',
    selectedViolations.map((v) => v.id),
  );

  const handlePhotoCapture = (file: PhotoFile) => {
    console.log(file);
    navigation.navigate('ParkingViolations_Qr');
  };

  return (
    <ScreenContainer title={t(ParkingViolationTexts.photo.title)}>
      <ThemeText color={themeColor}>
        {t(ParkingViolationTexts.photo.instruction)}
      </ThemeText>
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
  },
}));
