import {getTextForLanguage, useTranslation} from '@atb/translations';
import {showAppMissingAlert} from '../show-app-missing-alert';
import React, {useCallback} from 'react';
import {Button} from '@atb/components/button';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import BonusProgramTexts from '@atb/translations/screens/subscreens/BonusProgram';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';
import {Linking} from 'react-native';
import {useValueCodeMutation} from '../queries/use-value-code-mutation';
import {useIsEligibleForBenefit} from '../use-is-eligible-for-benefit';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useThemeContext} from '@atb/theme';
import {useClaimBonusProductVoucherMutation} from '@atb/modules/bonus';
import {stringifyUrl} from '@atb/api/utils';
import {useOperators} from '../use-operators';
import {useOperatorBenefit} from '../use-operator-benefit';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {Loading} from '@atb/components/loading';

type OperatorActionButtonProps = {
  operatorId: string | undefined;
  operatorName: string;
  appStoreUri: string | undefined;
  rentalAppUri: string;
  isBonusPayment?: boolean;
  setIsBonusPayment?: (isBonusPayment: boolean) => void;
  bonusProductId?: string;
  /**
   * When provided, the button is driven by the server `actionButton` of type
   * `APP_SWITCH`: it shows `label` and mints/claims a voucher via the app-switch
   * endpoint before opening the returned deep link. This bypasses the legacy
   * operator-benefit value-code flow below.
   */
  appSwitchAction?: AppSwitchAction;
};

type AppSwitchAction = {
  label: string;
  onPress: () => void;
  isLoading: boolean;
  hasError: boolean;
};

export const OperatorActionButton = ({
  operatorId,
  operatorName,
  appStoreUri,
  rentalAppUri,
  isBonusPayment,
  setIsBonusPayment,
  bonusProductId,
  appSwitchAction,
}: OperatorActionButtonProps) => {
  const {logEvent} = useAnalyticsContext();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const operator = useOperators().byId(operatorId);
  const {operatorBenefit} = useOperatorBenefit(operatorId);
  const extendedRentalAppUri = stringifyUrl(
    rentalAppUri,
    operator?.rentalAppUriQueryParams,
  );

  const {
    isUserEligibleForBenefit,
    benefitRequiresValueCodeToUnlock,
    isLoading: isLoadingEligible,
  } = useIsEligibleForBenefit(operatorBenefit);

  const {
    mutateAsync: fetchValueCode,
    isPending: isFetchingValueCode,
    isError: isFetchingValueCodeError,
  } = useValueCodeMutation(operatorId);

  const {
    mutateAsync: claimBonusProductVoucher,
    isPending: isClaimingVoucher,
    isError: isClaimingVoucherError,
  } = useClaimBonusProductVoucherMutation(bonusProductId, operatorId);

  const needsValueCode =
    (isUserEligibleForBenefit || isBonusPayment) &&
    benefitRequiresValueCodeToUnlock;
  const isLoading =
    isLoadingEligible ||
    (needsValueCode &&
      (isBonusPayment ? isClaimingVoucher : isFetchingValueCode));
  const hasError =
    needsValueCode &&
    (isBonusPayment ? isClaimingVoucherError : isFetchingValueCodeError);

  const defaultButtonText = t(
    MobilityTexts.operatorAppSwitchButton(operatorName),
  );

  const buttonText = isBonusPayment
    ? t(BonusProgramTexts.getCampaignPriceAt(operatorName))
    : ((isUserEligibleForBenefit
        ? getTextForLanguage(operatorBenefit?.callToAction?.name, language)
        : null) ?? defaultButtonText);

  const openAppURL = useCallback(
    async (url: string, valueCode?: string) => {
      logEvent('Mobility', 'Open operator app', {
        operatorName,
        operatorBenefit,
        isUserEligibleForBenefit,
        valueCode,
        isBonusPayment,
      });

      await Linking.openURL(url).catch(() =>
        showAppMissingAlert(operatorName, appStoreUri),
      );
    },
    [
      logEvent,
      operatorName,
      operatorBenefit,
      isUserEligibleForBenefit,
      appStoreUri,
      isBonusPayment,
    ],
  );

  const buildUrlWithValueCode = useCallback(
    (valueCode?: string) => {
      let url = extendedRentalAppUri;
      if (operatorBenefit?.callToAction.url) {
        // Benefit urls can contain variables to be re replaced runtime, e.g. '{APP_URL}?voucherCode={VOUCHER_CODE}'
        url = replaceTokens(operatorBenefit.callToAction.url, {
          APP_URL: extendedRentalAppUri,
          VALUE_CODE: valueCode,
        });
        // If callToAction.url is e.g. '{APP_URL}?voucherCode={VOUCHER_CODE}' the APP_URL token will now
        // have been replaced with rentalAppUri, e.g. 'trondheimbysykkel://stations?id=44', and look like this:
        // 'trondheimbysykkel://stations?id=44?voucherCode=1234'. Since both APP_URL and callToAction.url contains
        // url parameters we need to replace all but the first ? with & to create a valid url.
        url = replaceAllButFirstOccurrence(url, /\?/, '&');
      }

      return url;
    },
    [extendedRentalAppUri, operatorBenefit],
  );

  const buttonOnPress = useCallback(async () => {
    if (needsValueCode) {
      const getValueCode = isBonusPayment
        ? claimBonusProductVoucher
        : fetchValueCode;
      const valueCode = await getValueCode();

      if (valueCode) {
        const url = buildUrlWithValueCode(valueCode);
        await openAppURL(url, valueCode);

        // Reset bonus payment state after using value code
        setIsBonusPayment && setIsBonusPayment(false);
      }
    } else {
      await openAppURL(extendedRentalAppUri);
    }
  }, [
    needsValueCode,
    isBonusPayment,
    claimBonusProductVoucher,
    fetchValueCode,
    buildUrlWithValueCode,
    openAppURL,
    extendedRentalAppUri,
    setIsBonusPayment,
  ]);

  if (appSwitchAction) {
    if (appSwitchAction.isLoading) {
      return <Loading />;
    }
    if (appSwitchAction.hasError) {
      return (
        <MessageInfoBox
          type="error"
          message={t(MobilityTexts.errorLoadingValueCode.message)}
          onPressConfig={{
            action: appSwitchAction.onPress,
            text: t(MobilityTexts.errorLoadingValueCode.retry),
          }}
        />
      );
    }
    return (
      <Button
        expanded={true}
        text={appSwitchAction.label}
        onPress={appSwitchAction.onPress}
        mode="primary"
        interactiveColor={theme.color.interactive[0]}
        rightIcon={{svg: ExternalLink}}
        accessibilityRole="link"
      />
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return (
      <MessageInfoBox
        type="error"
        message={t(MobilityTexts.errorLoadingValueCode.message)}
        onPressConfig={{
          action: buttonOnPress,
          text: t(MobilityTexts.errorLoadingValueCode.retry),
        }}
      />
    );
  }

  return (
    <Button
      expanded={true}
      text={buttonText}
      onPress={buttonOnPress}
      mode="primary"
      interactiveColor={theme.color.interactive[0]}
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
