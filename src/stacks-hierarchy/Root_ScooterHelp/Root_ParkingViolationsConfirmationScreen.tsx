import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {ConfirmationScreenComponent} from '@atb/stacks-hierarchy/Root_ScooterHelp/components/ConfirmationScreenComponent';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

export type ConfirmationScreenProps =
  RootStackScreenProps<'Root_ParkingViolationsConfirmationScreen'>;

export const Root_ParkingViolationsConfirmationScreen = ({
  navigation,
  route: {params},
}: ConfirmationScreenProps) => {
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();
  const focusRef = useFocusOnLoad(navigation);
  const closeReporting = () => {
    analytics.logEvent('Mobility', 'Parking violation report sent');
    navigation.popToTop();
  };

  return (
    <ConfirmationScreenComponent
      title={t(ParkingViolationTexts.confirmation.title)}
      description={t(
        ParkingViolationTexts.confirmation.description(params.providerName),
      )}
      onClose={closeReporting}
      focusRef={focusRef}
    />
  );
};
