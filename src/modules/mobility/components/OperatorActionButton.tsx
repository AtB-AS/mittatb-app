import {getTextForLanguage, useTranslation} from '@atb/translations';
import {showAppMissingAlert} from '../show-app-missing-alert';
import React, {useCallback} from 'react';
import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {ActivityIndicator, Linking} from 'react-native';
import {useValueCodeMutation} from '../queries/use-value-code-mutation';
import {useIsEligibleForBenefit} from '../use-is-eligible-for-benefit';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useThemeContext} from '@atb/theme';
import {useBuyValueCodeWithBonusPointsMutation} from '@atb/modules/bonus';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';

type OperatorActionButtonProps = {
  operatorId: string | undefined;
  operatorName: string;
  benefit: OperatorBenefitType | undefined;
  appStoreUri: string | undefined;
  rentalAppUri: string;
  isBonusPayment?: boolean;
  setIsBonusPayment?: (isBonusPayment: boolean) => void;
  bonusProductId?: string;
};
export const OperatorActionButton = ({
  operatorId,
  operatorName,
  benefit,
  appStoreUri,
  rentalAppUri,
  isBonusPayment,
  setIsBonusPayment,
  bonusProductId,
}: OperatorActionButtonProps) => {
  const {logEvent} = useBottomSheetContext();
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
    logEvent('Mobility', 'Open operator app', {
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
  } else if (
    (isUserEligibleForBenefit || isBonusPayment) &&
    benefitRequiresValueCodeToUnlock
  ) {
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

      setIsBonusPayment && setIsBonusPayment(false);
    };
    return (
      <OperatorActionButtonWithValueCode
        operatorId={operatorId}
        buttonOnPress={buttonOnPress}
        buttonText={buttonText}
        isBonusPayment={isBonusPayment}
        bonusProductId={bonusProductId}
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
  isBonusPayment: boolean | undefined;
  setIsBonusPayment?: (isBonusPayment: boolean) => void;
  bonusProductId?: string;
};
const OperatorActionButtonWithValueCode = ({
  operatorId,
  buttonOnPress,
  buttonText,
  isBonusPayment,
  bonusProductId,
}: OperatorActionButtonWithValueCodeProps) => {
  const {t} = useTranslation();

  const {
    mutateAsync: fetchValueCode,
    isLoading: isFetchingValueCode,
    isError: isFetchingValueCodeError,
  } = useValueCodeMutation(operatorId);

  const {
    mutateAsync: buyBonusProduct,
    isLoading: isBuyingValueCode,
    isError: isBuyingValueCodeError,
  } = useBuyValueCodeWithBonusPointsMutation(bonusProductId);

  const getValueCode = isBonusPayment ? buyBonusProduct : fetchValueCode;

  const appSwitchButtonOnPress = useCallback(async () => {
    const valueCode = await getValueCode();
    valueCode && buttonOnPress(valueCode);
  }, [buttonOnPress, getValueCode]);

  const isLoading = isBonusPayment ? isBuyingValueCode : isFetchingValueCode;
  const isError = isBonusPayment
    ? isBuyingValueCodeError
    : isFetchingValueCodeError;

  if (isLoading) {
    return <ActivityIndicator />;
  } else if (isError) {
    return (
      <MessageInfoBox
        type="error"
        message={t(MobilityTexts.errorLoadingValueCode.message)}
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
