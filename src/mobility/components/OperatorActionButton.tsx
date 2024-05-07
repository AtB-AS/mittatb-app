import {useAnalytics} from '@atb/analytics';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useAppMissingAlert} from '@atb/mobility/use-app-missing-alert';
import React from 'react';
import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ActivityIndicator, Linking} from 'react-native';
import {useValueCodeQuery} from '@atb/mobility/queries/use-value-code-query';
import {useIsEligibleForBenefit} from '@atb/mobility/use-is-eligible-for-benefit';

type Props = {
  operatorId: string | undefined;
  operatorName: string;
  benefit: OperatorBenefitType | undefined;
  appStoreUri: string | undefined;
  rentalAppUri: string;
};
export const OperatorActionButton = ({
  operatorId,
  operatorName,
  benefit,
  appStoreUri,
  rentalAppUri,
}: Props) => {
  const analytics = useAnalytics();
  const {t, language} = useTranslation();
  const {showAppMissingAlert} = useAppMissingAlert();
  const {
    isUserEligibleForBenefit,
    benefitRequiresValueCodeToUnlock,
    isLoading: isLoadingEligible,
  } = useIsEligibleForBenefit(benefit);

  const {data: valueCode, isLoading: isLoadingValueCode} = useValueCodeQuery(
    operatorId,
    isUserEligibleForBenefit && benefitRequiresValueCodeToUnlock,
  );

  const buttonText =
    isUserEligibleForBenefit && benefit?.callToAction?.name
      ? getTextForLanguage(benefit.callToAction.name, language) ??
        t(MobilityTexts.operatorAppSwitchButton(operatorName))
      : t(MobilityTexts.operatorAppSwitchButton(operatorName));

  const handleCallToAction = async () => {
    analytics.logEvent('Mobility', 'Open operator app', {
      operatorName,
      benefit,
      isUserEligibleForBenefit,
    });
    let url = rentalAppUri;
    if (isUserEligibleForBenefit && benefit?.callToAction.url) {
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
  };

  if (isLoadingEligible || isLoadingValueCode) {
    return <ActivityIndicator />;
  }

  return (
    <Button
      text={buttonText}
      onPress={handleCallToAction}
      mode="primary"
      interactiveColor="interactive_0"
      rightIcon={{svg: ExternalLink}}
      accessibilityRole="link"
    />
  );
};

function replaceTokens(
  template: string,
  tokens: {[key: string]: string | null | undefined},
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
