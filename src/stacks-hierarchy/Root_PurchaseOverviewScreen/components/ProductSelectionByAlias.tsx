import React from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {isProductSellableInApp} from '@atb/reference-data/utils';
import {ThemeText} from '@atb/components/text';
import {InteractiveColor} from '@atb/theme/colors';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {FareProductTypeConfig} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {ProductAliasChip} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ProductAliasChip';
import {useTicketingState} from '@atb/ticketing';

type Props = {
  color: InteractiveColor;
  selectedProduct: PreassignedFareProduct;
  fareProductTypeConfig: FareProductTypeConfig;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelectionByAlias({
  color,
  selectedProduct,
  fareProductTypeConfig,
  setSelectedProduct,
  style,
}: Props) {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();

  const selectableProducts = preassignedFareProducts
    .filter((product) => isProductSellableInApp(product, customerProfile))
    .filter((product) => product.type === selectedProduct.type);

  const title = useTextForLanguage(
    fareProductTypeConfig.configuration.productSelectionTitle,
  );

  return (
    <View style={style}>
      <ThemeText type="body__secondary" color="secondary">
        {title || t(PurchaseOverviewTexts.productSelection.title)}
      </ThemeText>
      <ScrollView
        style={styles.durationScrollView}
        contentContainerStyle={styles.durationContentContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        testID={'selectDurationScrollView'}
      >
        {selectableProducts.map((fp, i) => {
          const text = getTextForLanguage(fp.productAlias, language);
          if (!text) return null;

          return (
            <ProductAliasChip
              color={color}
              text={text}
              selected={selectedProduct == fp}
              onPress={() => setSelectedProduct(fp)}
              key={i}
            />
          );
        })}
      </ScrollView>
    </View>
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
}));
