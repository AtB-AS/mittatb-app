import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useTranslation} from '@atb/translations';
import {useAnalyticsContext} from '@atb/analytics';
import {ConfirmationScreenComponent} from '@atb/scooter-help/ConfirmationScreenComponent';
import {ScooterOperatorContactTexts} from '@atb/translations/screens/ScooterOperatorContact';

export type ContactScooterOperatorConfirmationScreenProps =
  RootStackScreenProps<'Root_ContactScooterOperatorConfirmationScreen'>;

export const Root_ContactScooterOperatorConfirmationScreen = ({
  navigation,
  route: {params},
}: ContactScooterOperatorConfirmationScreenProps) => {
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const closeReporting = () => {
    analytics.logEvent('Mobility', 'Scooter Operator Contact form sent');
    navigation.popToTop();
  };

  return (
    <ConfirmationScreenComponent
      title={t(
        ScooterOperatorContactTexts.confirmation.title(params.operatorName),
      )}
      description={t(
        ScooterOperatorContactTexts.confirmation.description(
          params.operatorName,
        ),
      )}
      onClose={closeReporting}
    />
  );
};
