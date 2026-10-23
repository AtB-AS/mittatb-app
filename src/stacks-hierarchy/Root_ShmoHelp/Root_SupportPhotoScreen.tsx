import {PhotoFile} from '@atb/components/camera';
import {PhotoCapture} from '@atb/components/PhotoCapture';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {ContactShmoOperatorTexts} from '@atb/translations/screens/ContactScooterOperator';
import {useTranslation} from '@atb/translations';
import {useIsFocused} from '@react-navigation/native';
import {useCallback} from 'react';
import {usePendingSupportPhotoStore} from './use-support-images';

export type Root_SupportPhotoScreenProps =
  RootStackScreenProps<'Root_SupportPhotoScreen'>;

export const Root_SupportPhotoScreen = ({
  navigation,
}: Root_SupportPhotoScreenProps) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const setPendingPhoto = usePendingSupportPhotoStore(
    (state) => state.setPendingPhoto,
  );

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onConfirmImage = useCallback(
    (file: PhotoFile) => {
      setPendingPhoto(file.path);
      navigation.goBack();
    },
    [navigation, setPendingPhoto],
  );

  return (
    <PhotoCapture
      onConfirmImage={onConfirmImage}
      onGoBack={onGoBack}
      title={t(ContactShmoOperatorTexts.image.camera.title)}
      secondaryText={t(ContactShmoOperatorTexts.image.camera.instruction)}
      isFocused={isFocused}
    />
  );
};
