import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {formatFarePrice} from '@atb/utils/numbers';
import React from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';
import type {PurchaseSelectionType} from '@atb/purchase-selection';

type Props = {
  selection: PurchaseSelectionType;
  price: number;
  originalPrice: number;
  isFree: boolean;
  isLoading: boolean;
  isError: boolean;
  summaryButtonText: string;
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Summary({
  selection,
  price,
  originalPrice,
  isFree,
  isLoading,
  isError,
  summaryButtonText,
  onPressBuy,
  style,
}: Props) {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();

  const formattedPrice = formatFarePrice(price, language);
  const formattedOriginalPrice = formatFarePrice(originalPrice, language);
  const hasSelection = selection.userProfilesWithCount.some((u) => u.count);

  const toPaymentFunction = () => {
    onPressBuy();
  };

  return (
    <View style={style}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ThemeText
          typography="body__primary--bold"
          style={styles.price}
          testID="offerTotalPriceText"
        >
          {t(PurchaseOverviewTexts.summary.price(formattedPrice))}
        </ThemeText>
      )}
      {!isLoading && originalPrice !== price && (
        <ThemeText
          typography="body__tertiary--strike"
          style={styles.originalPrice}
          testID="offerTotalPriceText"
          accessibilityLabel={t(
            PurchaseOverviewTexts.summary.ordinaryPriceA11yLabel(
              formattedOriginalPrice,
            ),
          )}
        >
          {t(PurchaseOverviewTexts.summary.price(formattedOriginalPrice))}
        </ThemeText>
      )}
      <Button
        expanded={true}
        interactiveColor={theme.color.interactive[0]}
        text={summaryButtonText}
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
  originalPrice: {
    textAlign: 'center',
    marginTop: theme.spacing.medium,
  },
  free: {
    marginTop: theme.spacing.medium,
  },
  message: {textAlign: 'center', marginTop: theme.spacing.medium},
  button: {marginTop: theme.spacing.xLarge},
}));
