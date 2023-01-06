import React from 'react';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {ThemeText} from '@atb/components/text';
import {InteractiveColor} from '@atb/theme/colors';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {ScrollView} from 'react-native';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type ProductSelectionByDurationProps = {
  color: InteractiveColor;
  selectedProduct: PreassignedFareProduct;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export default function ProductSelectionByDuration({
  color,
  selectedProduct,
  setSelectedProduct,
  style,
}: ProductSelectionByDurationProps) {
  const {t} = useTranslation();
  const styles = useStyles();
  const {preassignedFareProducts} = useFirestoreConfiguration();

  const selectableProducts = preassignedFareProducts
    .filter(productIsSellableInApp)
    .filter((p) => p.type === selectedProduct.type);

  return (
    <View style={style}>
      <ThemeText type="body__secondary" color="secondary">
        {t(PurchaseOverviewTexts.duration.title)}
      </ThemeText>
      <ScrollView
        style={styles.durationScrollView}
        contentContainerStyle={styles.durationContentContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        testID={'selectDurationScrollView'}
      >
        {selectableProducts.map((fp, i) => (
          <DurationChip
            color={color}
            text={
              fp.durationDays + ' ' + t(PurchaseOverviewTexts.duration.days)
            }
            selected={selectedProduct == fp}
            onPress={() => setSelectedProduct(fp)}
            key={i}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type DurationChipProps = {
  color: InteractiveColor;
  text: string;
  selected: boolean;
  onPress: () => void;
};

function DurationChip({color, text, selected, onPress}: DurationChipProps) {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const currentColor =
    theme.interactive[color][selected ? 'active' : 'default'];

  // To make items with and without border the same size, we subtract the border
  // width from the padding when there is a border.
  const borderOffset = selected ? theme.border.width.medium : 0;

  return (
    <TouchableOpacity
      style={[
        styles.durationChip,
        {
          backgroundColor: currentColor.background,
          borderColor: theme.interactive[color].outline.background,
          borderWidth: borderOffset,
          paddingVertical: theme.spacings.medium - borderOffset,
          paddingHorizontal: theme.spacings.xLarge - borderOffset,
        },
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{selected}}
      accessibilityLabel={text}
      accessibilityHint={t(PurchaseOverviewTexts.duration.chipHint)}
      testID={'chip' + text.replace(' ', '')}
    >
      <ThemeText
        color={currentColor}
        type={selected ? 'body__secondary--bold' : 'body__secondary'}
      >
        {text}
      </ThemeText>
    </TouchableOpacity>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  durationScrollView: {
    marginTop: theme.spacings.medium,
    marginLeft: -theme.spacings.medium,
    marginRight: -theme.spacings.medium,
  },
  durationContentContainer: {
    flexDirection: 'row',
    marginLeft: theme.spacings.medium,
    paddingRight: theme.spacings.medium,
  },
  durationChip: {
    justifyContent: 'center',
    borderRadius: theme.border.radius.circle * 2,
    marginRight: theme.spacings.small,
  },
}));
