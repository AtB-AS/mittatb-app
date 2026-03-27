import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useTranslation} from '@atb/translations';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {ConfirmationScreenComponent} from '@atb/stacks-hierarchy/Root_ShmoHelp/components/ConfirmationScreenComponent';
import {ContactShmoOperatorTexts} from '@atb/translations/screens/ContactScooterOperator';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export type ContactShmoOperatorConfirmationScreenProps =
  RootStackScreenProps<'Root_ContactShmoOperatorConfirmationScreen'>;

export const Root_ContactShmoOperatorConfirmationScreen = ({
  navigation,
  route: {params},
}: ContactShmoOperatorConfirmationScreenProps) => {
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();
  const focusRef = useFocusOnLoad(navigation);
  const closeReporting = () => {
    analytics.logEvent('Mobility', 'Scooter Operator Contact form sent');
    navigation.popToTop();
  };

  return (
    <ConfirmationScreenComponent
      title={t(
        ContactShmoOperatorTexts.confirmation.title(params.operatorName),
      )}
      description={t(
        ContactShmoOperatorTexts.confirmation.description(params.operatorName),
      )}
      onClose={closeReporting}
      focusRef={focusRef}
    />
  );
};
