import {useAnalyticsContext} from '@atb/analytics';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {showAppMissingAlert} from '@atb/mobility/show-app-missing-alert';
import React, {useCallback} from 'react';
import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ActivityIndicator, Linking} from 'react-native';
import {useValueCodeMutation} from '@atb/mobility/queries/use-value-code-mutation';
import {useIsEligibleForBenefit} from '@atb/mobility/use-is-eligible-for-benefit';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useThemeContext} from '@atb/theme';

type OperatorActionButtonProps = {
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
}: OperatorActionButtonProps) => {
  const analytics = useAnalyticsContext();
  const {t, language} = useTranslation();
  const {
    isUserEligibleForBenefit,
    benefitRequiresValueCodeToUnlock,
    isLoading: isLoadingEligible,
  } = useIsEligibleForBenefit(benefit);

  const buttonText =
    isUserEligibleForBenefit && benefit?.callToAction?.name
      ? getTextForLanguage(benefit.callToAction.name, language) ??
        t(MobilityTexts.operatorAppSwitchButton(operatorName))
      : t(MobilityTexts.operatorAppSwitchButton(operatorName));

  const openAppURL = async (url: string, valueCode?: string) => {
    analytics.logEvent('Mobility', 'Open operator app', {
      operatorName,
      benefit,
      isUserEligibleForBenefit,
      valueCode,
    });
    await Linking.openURL(url).catch(() =>
      showAppMissingAlert(operatorName, appStoreUri),
    );
  };

  if (isLoadingEligible) {
    return <ActivityIndicator />;
  } else if (isUserEligibleForBenefit && benefitRequiresValueCodeToUnlock) {
    const buttonOnPress = (valueCode?: string) => {
      let url = rentalAppUri;
      if (benefit?.callToAction.url) {
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
      openAppURL(url, valueCode);
    };
    return (
      <OperatorActionButtonWithValueCode
        operatorId={operatorId}
        buttonOnPress={buttonOnPress}
        buttonText={buttonText}
      />
    );
  } else {
    return (
      <AppSwitchButton
        buttonOnPress={() => openAppURL(rentalAppUri)}
        buttonText={buttonText}
      />
    );
  }
};

type AppSwitchButtonProps = {
  buttonOnPress: (valueCode?: string) => void;
  buttonText: string;
};

const AppSwitchButton = ({buttonOnPress, buttonText}: AppSwitchButtonProps) => {
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];

  return (
    <Button
      expanded={true}
      text={buttonText}
      onPress={() => buttonOnPress()}
      mode="primary"
      interactiveColor={interactiveColor}
      rightIcon={{svg: ExternalLink}}
      accessibilityRole="link"
    />
  );
};

type OperatorActionButtonWithValueCodeProps = AppSwitchButtonProps & {
  operatorId: string | undefined;
};
const OperatorActionButtonWithValueCode = ({
  operatorId,
  buttonOnPress,
  buttonText,
}: OperatorActionButtonWithValueCodeProps) => {
  const {t} = useTranslation();

  const {
    mutateAsync: fetchValueCode,
    isLoading: isFetchingValueCode,
    isError: isFetchingValueCodeError,
  } = useValueCodeMutation(operatorId);

  const appSwitchButtonOnPress = useCallback(async () => {
    const valueCode = await fetchValueCode();
    valueCode && buttonOnPress(valueCode);
  }, [buttonOnPress, fetchValueCode]);

  if (isFetchingValueCode) {
    return <ActivityIndicator />;
  } else if (isFetchingValueCodeError) {
    return (
      <MessageInfoBox
        type="error"
        title={t(MobilityTexts.errorLoadingValueCode.title)}
        message={t(MobilityTexts.errorLoadingValueCode.text)}
        onPressConfig={{
          action: appSwitchButtonOnPress,
          text: t(MobilityTexts.errorLoadingValueCode.retry),
        }}
      />
    );
  }

  return (
    <AppSwitchButton
      buttonOnPress={appSwitchButtonOnPress}
      buttonText={buttonText}
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
