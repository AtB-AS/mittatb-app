import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useAnalytics} from '@atb/analytics';
import {useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useAppMissingAlert} from '@atb/mobility/use-app-missing-alert';

type Props = {
  operatorName: string;
  appStoreUri: string | undefined;
  rentalAppUri: string | undefined;
};
export const OperatorAppSwitchButton = ({
  operatorName,
  appStoreUri,
  rentalAppUri,
}: Props) => {
  const analytics = useAnalytics();
  const {t} = useTranslation();
  const {showAppMissingAlert} = useAppMissingAlert();

  const openOperatorApp = useCallback(async () => {
    analytics.logEvent('Mobility', 'Open operator app', {operatorName});
    if (!rentalAppUri) return;
    await Linking.openURL(rentalAppUri).catch(() =>
      showAppMissingAlert({appStoreUri, operatorName}),
    );
  }, [operatorName, appStoreUri, rentalAppUri]);

  return (
    <Button
      text={t(MobilityTexts.operatorAppSwitchButton(operatorName))}
      onPress={openOperatorApp}
      mode="primary"
      interactiveColor="interactive_0"
    />
  );
};
