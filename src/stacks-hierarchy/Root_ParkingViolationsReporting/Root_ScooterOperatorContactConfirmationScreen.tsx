import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useTranslation} from '@atb/translations';
import {useAnalyticsContext} from '@atb/analytics';
import {ConfirmationScreen} from '@atb/scooter-help/components/ConfirmationScreen';
import {ScooterOperatorContactTexts} from '@atb/translations/screens/ScooterOperatorContact';

export type ConfirmationScreenProps =
  RootStackScreenProps<'Root_ScooterOperatorContactConfirmationScreen'>;

export const Root_ScooterOperatorContactConfirmationScreen = ({
  navigation,
  route: {params},
}: ConfirmationScreenProps) => {
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();

  const closeReporting = () => {
    analytics.logEvent('Mobility', 'Scooter Operator Contact form sent');
    navigation.popToTop();
  };

  return (
    <ConfirmationScreen
      title={t(
        ScooterOperatorContactTexts.confirmation.title(params.operatorName),
      )}
      description={t(
        ScooterOperatorContactTexts.confirmation.description(
          params.operatorName,
        ),
      )}
      accessibilityLabel={t(
        ScooterOperatorContactTexts.confirmation.closeA11yHint,
      )}
      onClose={closeReporting}
    />
  );
};
