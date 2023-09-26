import {Button} from '@atb/components/button';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {ScreenContainer} from './ScreenContainer';
import {ParkingViolationsScreenProps} from './navigation-types';

export type SummaryScreenProps =
  ParkingViolationsScreenProps<'ParkingViolations_Summary'>;

export const ParkingViolations_Summary = ({}: SummaryScreenProps) => {
  const {t} = useTranslation();

  return (
    <ScreenContainer
      title={t(ParkingViolationTexts.summary.title)}
      buttons={
        <Button
          interactiveColor="interactive_0"
          onPress={() => {}}
          text={t(ParkingViolationTexts.summary.submitButton)}
          testID="nextButton"
          accessibilityHint={''} //TODO
        />
      }
    ></ScreenContainer>
  );
};
