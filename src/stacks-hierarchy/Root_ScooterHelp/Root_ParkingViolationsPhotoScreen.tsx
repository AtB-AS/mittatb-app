import {PhotoFile} from '@atb/components/camera';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useParkingViolations} from '@atb/parking-violations-reporting';
import {PhotoCapture} from '@atb/components/PhotoCapture';

export type PhotoScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsPhotoScreen'>;

export const Root_ParkingViolationsPhotoScreen = ({
  navigation,
  route: {params},
}: PhotoScreenProps) => {
  const {t} = useTranslation();
  const {coordinates, isLoading} = useParkingViolations();

  const onConfirmImage = (file: PhotoFile) => {
    navigation.navigate('Root_ParkingViolationsQrScreen', {
      ...params,
      photo: file.path,
    });
  };

  return (
    <PhotoCapture
      onConfirmImage={onConfirmImage}
      coordinates={coordinates}
      title={t(ParkingViolationTexts.photo.title)}
      secondaryText={t(ParkingViolationTexts.photo.instruction)}
      isLoading={isLoading}
    />
  );
};
