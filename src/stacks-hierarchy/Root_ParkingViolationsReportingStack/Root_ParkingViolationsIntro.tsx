import {Button} from '@atb/components/button';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';

export type IntroScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Intro'>;

export const ParkingViolations_Intro = ({navigation}: IntroScreenProps) => {
  const {t} = useTranslation();

  return (
    <ScreenContainer
      leftHeaderButton={{type: 'close'}}
      buttons={
        <Button
          onPress={() =>
            navigation.navigate('ParkingViolations_SelectViolation')
          }
          text={t(ParkingViolationTexts.intro.nextButton)}
          testID="nextButton"
          accessibilityHint={''} //TODO
        />
      }
    ></ScreenContainer>
  );
};
