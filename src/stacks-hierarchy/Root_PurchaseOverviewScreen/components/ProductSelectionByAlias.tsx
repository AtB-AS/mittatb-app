import React from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {InteractiveColor} from '@atb/theme/colors';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {
  useFirestoreConfiguration,
  PreassignedFareProduct,
  isProductSellableInApp,
  FareProductTypeConfig,
} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {ProductAliasChip} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ProductAliasChip';
import {useTicketingState} from '@atb/ticketing';
import {ContentHeading} from '@atb/components/heading';

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
      <ContentHeading
        text={title || t(PurchaseOverviewTexts.productSelection.title)}
      />
      <ScrollView
        style={styles.durationScrollView}
        contentContainerStyle={styles.durationContentContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        testID="selectDurationScrollView"
      >
        {selectableProducts.map((fp, i) => {
          const text = getTextForLanguage(fp.productAlias, language);
          if (!text) return null;

          return (
            <ProductAliasChip
              color={color}
              text={text}
              selected={selectedProduct.id === fp.id}
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
    marginLeft: -theme.spacing.medium,
    marginRight: -theme.spacing.medium,
  },
  durationContentContainer: {
    flexDirection: 'row',
    marginLeft: theme.spacing.medium,
    paddingRight: theme.spacing.medium,
  },
}));
