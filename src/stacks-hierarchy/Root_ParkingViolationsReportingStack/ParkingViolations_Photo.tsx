import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ScreenContainer} from './ScreenContainer';
import {useTranslation} from '@atb/translations';
import {ParkingViolationsScreenProps} from './navigation-types';

export type WelcomeScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Photo'>;

export const ParkingViolations_Photo = () => {
  const {t} = useTranslation();

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.photo.title)}
    ></ScreenContainer>
  );
};
