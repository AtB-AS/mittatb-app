import {useAnalytics} from '@atb/analytics';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useAppMissingAlert} from '@atb/mobility/use-app-missing-alert';
import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';

type Props = {
  benefit: OperatorBenefitType;
  operatorName: string;
  appStoreUri: string | undefined;
  rentalAppUri: string | undefined;
};
export const OperatorBenefitActionButton = ({
  benefit,
  operatorName,
  appStoreUri,
  rentalAppUri,
}: Props) => {
  const analytics = useAnalytics();
  const {t, language} = useTranslation();
  const {showAppMissingAlert} = useAppMissingAlert();

  const buttonText =
    getTextForLanguage(benefit.callToAction.name, language) ??
    t(MobilityTexts.operatorAppSwitchButton(operatorName));

  const handleCallToAction = useCallback(async () => {
    analytics.logEvent('Mobility', 'Claim bundled benefit', {operatorName});
    if (benefit.callToAction.url) {
      return await Linking.openURL(benefit.callToAction.url).catch(() =>
        showAppMissingAlert({appStoreUri, operatorName}),
      );
    }
    if (rentalAppUri) {
      return await Linking.openURL(rentalAppUri).catch(() =>
        showAppMissingAlert({appStoreUri, operatorName}),
      );
    }
    console.warn('Neither benefit.callToAction.url or rentalAppUri is defined');
  }, [operatorName, benefit, rentalAppUri, appStoreUri]);

  return (
    <Button
      text={buttonText}
      onPress={handleCallToAction}
      mode="primary"
      interactiveColor="interactive_0"
    />
  );
};
