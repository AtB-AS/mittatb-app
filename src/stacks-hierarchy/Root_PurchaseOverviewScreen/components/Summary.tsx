import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {FareProductTypeConfig} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import React from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import {MessageBox} from '@atb/components/message-box';

type Props = {
  price: number;
  isFree: boolean;
  isLoading: boolean;
  isError: boolean;
  userProfilesWithCount: UserProfileWithCount[];
  fareProductTypeConfig: FareProductTypeConfig;
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Summary({
  price,
  isFree,
  isLoading,
  isError,
  userProfilesWithCount,
  fareProductTypeConfig,
  onPressBuy,
  style,
}: Props) {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const formattedPrice = formatDecimalNumber(price, language, 2);
  const hasSelection = userProfilesWithCount.some((u) => u.count);

  const toPaymentFunction = () => {
    onPressBuy();
  };

  const SummaryText = () => {
    const summary = (text: string) => (
      <ThemeText type="body__secondary" style={styles.message}>
        {text}
      </ThemeText>
    );
    const requiredOnMobileText = fareProductTypeConfig.configuration
      .requiresTokenOnMobile
      ? summary(t(PurchaseOverviewTexts.summary.messageRequiresMobile))
      : null;

    switch (fareProductTypeConfig.configuration.zoneSelectionMode) {
      case 'multiple-stop-harbor':
        const harborText = summary(
          t(PurchaseOverviewTexts.summary.messageInHarborZones),
        );
        return (
          <>
            {summary(
              t(
                PurchaseOverviewTexts.summary[
                  fareProductTypeConfig.type === 'boat-period'
                    ? 'messageInHarborPeriod'
                    : 'messageInHarborSingle'
                ],
              ),
            )}
            {harborText}
            {requiredOnMobileText}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={style}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <ThemeText
            type="body__primary--bold"
            style={styles.price}
            testID="offerTotalPriceText"
          >
            {t(PurchaseOverviewTexts.summary.price(formattedPrice))}
          </ThemeText>
          <SummaryText />
        </>
      )}
      {isFree && (
        <MessageBox
          type="valid"
          message={t(PurchaseOverviewTexts.summary.free)}
          style={styles.free}
        />
      )}
      <Button
        interactiveColor="interactive_0"
        text={t(PurchaseOverviewTexts.summary.button)}
        disabled={isLoading || !hasSelection || isFree || isError}
        onPress={toPaymentFunction}
        rightIcon={{svg: ArrowRight}}
        testID="goToPaymentButton"
        style={styles.button}
      />
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  price: {
    textAlign: 'center',
  },
  free: {
    marginTop: theme.spacings.medium,
  },
  message: {textAlign: 'center', marginTop: theme.spacings.medium},
  button: {marginTop: theme.spacings.xLarge},
}));
