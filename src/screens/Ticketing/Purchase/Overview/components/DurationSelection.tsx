import React from 'react';
import {DurationSelectionTexts, useTranslation} from '@atb/translations';
import {
  getReferenceDataName,
  productIsSellableInApp,
} from '@atb/reference-data/utils';
import ThemeText from '@atb/components/text';
import {InteractiveColor} from '@atb/theme/colors';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {ScrollView} from 'react-native';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type DurationSelectionProps = {
  color: InteractiveColor;
  selectedProduct: PreassignedFareProduct;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
};

export default function DurationSelection({
  color,
  selectedProduct,
  setSelectedProduct,
}: DurationSelectionProps) {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const {preassignedFareproducts} = useFirestoreConfiguration();

  const selectableProducts = preassignedFareproducts
    .filter(productIsSellableInApp)
    .filter((p) => p.type === selectedProduct.type);

  return (
    <>
      <ThemeText type="body__secondary" color="secondary">
        {t(DurationSelectionTexts.title)}
      </ThemeText>
      <ScrollView
        style={styles.durationScrollView}
        contentContainerStyle={styles.durationContentContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {selectableProducts.map((fp, i) => (
          <DurationChip
            color={color}
            text={getReferenceDataName(fp, language)}
            selected={selectedProduct == fp}
            onPress={() => setSelectedProduct(fp)}
            key={i}
          />
        ))}
      </ScrollView>
    </>
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

  // Reduce width and heigh by 2x border width to ensure that selected chips are
  // the same size as chips without a border.
  const borderOffset = selected ? theme.border.width.medium * 2 : 0;

  return (
    <TouchableOpacity
      style={[
        styles.durationChip,
        {
          backgroundColor: currentColor.background,
          borderColor: theme.interactive[color].outline.background,
          borderWidth: selected ? theme.border.width.medium : 0,
          paddingVertical: theme.spacings.medium - borderOffset,
          paddingHorizontal: theme.spacings.xLarge - borderOffset,
        },
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="radio"
      accessibilityState={{selected}}
      accessibilityHint={t(DurationSelectionTexts.chipHint)}
    >
      <ThemeText
        style={{
          color: currentColor.text,
        }}
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
    marginBottom: theme.spacings.xLarge,
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
