import {useAnalytics} from '@atb/analytics';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useAppMissingAlert} from '@atb/mobility/use-app-missing-alert';
import React, {useCallback} from 'react';
import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {Linking} from 'react-native';

type Props = {
  benefit: OperatorBenefitType;
  valueCode: string | undefined;
  operatorName: string;
  appStoreUri: string | undefined;
  rentalAppUri: string;
};
export const OperatorBenefitActionButton = ({
  benefit,
  valueCode,
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
    let url = rentalAppUri;
    if (benefit.callToAction.url) {
      // Benefit urls can contain variables to be re replaced runtime, e.g. '{APP_URL}?voucherCode={VOUCHER_CODE}'
      url = replaceTokens(benefit.callToAction.url, {
        APP_URL: rentalAppUri,
        VALUE_CODE: valueCode,
      });
      // If callToAction.url is e.g. '{APP_URL}?voucherCode={VOUCHER_CODE}' the APP_URL token will now
      // have been replaced with rentalAppUri, e.g. 'trondheimbysykkel://stations?id=44', and look like this:
      // 'trondheimbysykkel://stations?id=44?voucherCode=1234'. Since both APP_URL and callToAction.url contains
      // url parameters we need to replace all but the first ? with & to create a valid url.
      url = replaceAllButFirstOccurrence(url, /\?/, '&');
    }
    await Linking.openURL(url).catch(() =>
      showAppMissingAlert({appStoreUri, operatorName}),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operatorName, benefit, rentalAppUri, appStoreUri, valueCode]);

  return (
    <Button
      text={buttonText}
      onPress={handleCallToAction}
      mode="primary"
      interactiveColor="interactive_0"
      rightIcon={{svg: ExternalLink}}
    />
  );
};

function replaceTokens(
  template: string,
  tokens: {[key: string]: string | undefined},
) {
  return template.replace(
    /\{\s*([^}\s]+)\s*\}/g,
    (_, token: string) => tokens[token] ?? '',
  );
}

function replaceAllButFirstOccurrence(
  inputString: string,
  targetChar: RegExp | string,
  replacementChar: string,
) {
  const regex = new RegExp(targetChar, 'g');
  let firstOccurrenceReplaced = false;

  // Replace all occurrences, but skip the first one
  return inputString.replace(regex, (match: string) => {
    if (!firstOccurrenceReplaced) {
      firstOccurrenceReplaced = true;
      return match; // Skip replacing the first occurrence
    } else {
      return replacementChar; // Replace subsequent occurrences
    }
  });
}
