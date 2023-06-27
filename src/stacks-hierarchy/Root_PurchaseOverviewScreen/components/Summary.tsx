import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {FareProductTypeConfig} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {
  FareContractTexts,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import React from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';

type Props = {
  price: number;
  isLoading: boolean;
  isError: boolean;
  userProfilesWithCount: UserProfileWithCount[];
  fareProductTypeConfig: FareProductTypeConfig;
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Summary({
  price,
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

  const transportModesText = fareProductTypeConfig.transportModes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode)))
    .filter(Boolean)
    .join('/');

  const SummaryText = () => {
    switch (fareProductTypeConfig.configuration.zoneSelectionMode) {
      case 'multiple':
      case 'multiple-stop':
      case 'multiple-zone':
      case 'single':
      case 'single-stop':
      case 'single-zone':
        return (
          <ThemeText type="body__secondary" style={styles.message}>
            {t(PurchaseOverviewTexts.summary.messageInZone)}
          </ThemeText>
        );
      case 'none':
        return (
          <ThemeText type="body__secondary" style={styles.message}>
            {t(
              PurchaseOverviewTexts.summary.messageAppliesFor(
                transportModesText,
              ),
            )}
          </ThemeText>
        );
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

      <Button
        interactiveColor="interactive_0"
        text={t(PurchaseOverviewTexts.summary.button)}
        disabled={isLoading || !hasSelection || isError}
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
  message: {textAlign: 'center', marginTop: theme.spacings.medium},
  button: {marginTop: theme.spacings.xLarge},
}));
