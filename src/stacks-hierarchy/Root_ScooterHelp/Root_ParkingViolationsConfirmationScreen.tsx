import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useAnalyticsContext} from '@atb/analytics';
import {ConfirmationScreenComponent} from '@atb/scooter-help/ConfirmationScreenComponent';

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
    <ConfirmationScreenComponent
      title={t(ParkingViolationTexts.confirmation.title)}
      description={t(
        ParkingViolationTexts.confirmation.description(params.providerName),
      )}
      onClose={closeReporting}
    />
  );
};
