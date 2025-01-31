import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useAnalyticsContext} from '@atb/analytics';
import {ConfirmationScreen} from '@atb/stacks-hierarchy/Root_ScooterHelp/components/ConfirmationScreen';

export type ConfirmationScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsConfirmationScreen'>;

export const Root_ParkingViolationsConfirmationScreen = ({
  navigation,
  route: {params},
}: ConfirmationScreenProps) => {
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const closeReporting = () => {
    analytics.logEvent('Mobility', 'Parking violation report sent');
    navigation.popToTop();
  };

  return (
    <ConfirmationScreen
      title={t(ParkingViolationTexts.confirmation.title)}
      description={t(
        ParkingViolationTexts.confirmation.description(params.providerName),
      )}
      accessibilityLabel={t(ParkingViolationTexts.confirmation.closeA11yHint)}
      onClose={closeReporting}
    />
  );
};
