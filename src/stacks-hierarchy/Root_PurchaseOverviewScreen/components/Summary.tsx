import {formatNumberToString} from '@atb-as/utils';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {Loading} from '@atb/components/loading';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

type Props = {
  price?: number;
  originalPrice: number;
  isFree: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  summaryButtonText: string;
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Summary({
  price,
  originalPrice,
  isFree,
  isLoading,
  isDisabled,
  summaryButtonText,
  onPressBuy,
  style,
}: Props) {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();

  const formattedPrice = !!price
    ? formatNumberToString(price, language)
    : undefined;
  const formattedOriginalPrice = formatNumberToString(originalPrice, language);

  const toPaymentFunction = () => {
    onPressBuy();
  };

  return (
    <View style={style}>
      {!!formattedPrice ? (
        <ThemeText
          typography="heading__xl"
          style={styles.price}
          testID="offerTotalPriceText"
        >
          {t(PurchaseOverviewTexts.summary.price(formattedPrice))}
        </ThemeText>
      ) : isLoading ? (
        <Loading size="large" />
      ) : null}
      {!isLoading && !!formattedPrice && originalPrice !== price && (
        <ThemeText
          typography="body__xs__strike"
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
        disabled={isDisabled || isLoading || isFree}
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
