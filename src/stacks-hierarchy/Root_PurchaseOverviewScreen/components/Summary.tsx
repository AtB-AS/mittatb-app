import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {formatDecimalNumber} from '@atb/utils/numbers';
import React from 'react';
import {ActivityIndicator, StyleProp, View, ViewStyle} from 'react-native';

type Props = {
  price: number;
  originalPrice?: number;
  isFree: boolean;
  isLoading: boolean;
  isError: boolean;
  userProfilesWithCount: UserProfileWithCount[];
  summaryButtonText: string;
  onPressBuy: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Summary({
  price,
  originalPrice,
  isFree,
  isLoading,
  isError,
  userProfilesWithCount,
  summaryButtonText,
  onPressBuy,
  style,
}: Props) {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const formattedPrice = formatDecimalNumber(price, language, 2);
  const formattedOriginalPrice =
    originalPrice && formatDecimalNumber(originalPrice, language, 2);
  const hasSelection = userProfilesWithCount.some((u) => u.count);

  const toPaymentFunction = () => {
    onPressBuy();
  };

  return (
    <View style={style}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ThemeText
          type="body__primary--bold"
          style={styles.price}
          testID="offerTotalPriceText"
        >
          {t(PurchaseOverviewTexts.summary.price(formattedPrice))}
        </ThemeText>
      )}
      {formattedOriginalPrice && (
        <ThemeText
          type="body__tertiary--strike"
          style={styles.originalPrice}
          testID="offerTotalPriceText"
        >
          {t(PurchaseOverviewTexts.summary.price(formattedOriginalPrice))}
        </ThemeText>
      )}
      <Button
        interactiveColor="interactive_0"
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
    marginTop: theme.spacings.medium,
  },
  free: {
    marginTop: theme.spacings.medium,
  },
  message: {textAlign: 'center', marginTop: theme.spacings.medium},
  button: {marginTop: theme.spacings.xLarge},
}));
