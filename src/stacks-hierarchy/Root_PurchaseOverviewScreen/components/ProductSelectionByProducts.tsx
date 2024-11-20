import React from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  PreassignedFareProduct,
  useFirestoreConfiguration,
  getReferenceDataName,
  isProductSellableInApp,
} from '@atb/configuration';
import {FareProductTypeConfig} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {
  HeaderSectionItem,
  RadioGroupSection,
  Section,
} from '@atb/components/sections';
import {useTicketingState} from '@atb/ticketing';
import {ProductDescriptionToggle} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ProductDescriptionToggle';
import {usePreferenceItems} from '@atb/preferences';
import {ContentHeading} from '@atb/components/heading';
import {useTheme} from '@atb/theme';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';

type ProductSelectionByProductsProps = {
  selectedProduct: PreassignedFareProduct;
  fareProductTypeConfig: FareProductTypeConfig;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelectionByProducts({
  selectedProduct,
  fareProductTypeConfig,
  setSelectedProduct,
  style,
}: ProductSelectionByProductsProps) {
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const interactiveColor = theme.color.interactive[2];
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();
  const {hideProductDescriptions} = usePreferenceItems();

  const selectableProducts = preassignedFareProducts
    .filter((product) => isProductSellableInApp(product, customerProfile))
    .filter((product) => product.type === selectedProduct.type)
    .filter(onlyUniquesBasedOnField('productAliasId', true));

  const alias = (fareProduct: PreassignedFareProduct) =>
    fareProduct.productAlias &&
    getTextForLanguage(fareProduct.productAlias, language);

  const productDisplayName = (fareProduct: PreassignedFareProduct) =>
    alias(fareProduct)
      ? alias(fareProduct)!
      : getReferenceDataName(fareProduct, language);

  const title =
    useTextForLanguage(
      fareProductTypeConfig.configuration.productSelectionTitle,
    ) || t(PurchaseOverviewTexts.productSelection.title);

  const subText = (fp: PreassignedFareProduct) => {
    const descriptionMessage = getTextForLanguage(fp.description, language);
    const warningMessage = getTextForLanguage(fp.warningMessage, language);
    if (descriptionMessage && warningMessage) {
      return `${descriptionMessage}\n${warningMessage}`;
    }
    return descriptionMessage ?? warningMessage;
  };

  return (
    <View style={style}>
      {selectableProducts.length > 1 ? (
        <>
          <ProductDescriptionToggle title={title} />
          <RadioGroupSection<PreassignedFareProduct>
            items={selectableProducts}
            keyExtractor={(u) => u.productAliasId ?? u.id}
            itemToText={(fp) => productDisplayName(fp)}
            hideSubtext={hideProductDescriptions}
            itemToSubtext={(fp) => subText(fp)}
            selected={selectedProduct}
            color={interactiveColor}
            onSelect={setSelectedProduct}
            accessibilityHint={t(
              PurchaseOverviewTexts.productSelection.a11yTitle,
            )}
          />
        </>
      ) : (
        <>
          <ContentHeading text={title} />
          <Section>
            <HeaderSectionItem
              text={productDisplayName(selectedProduct)}
              subtitle={subText(selectedProduct)}
            />
          </Section>
        </>
      )}
    </View>
  );
}
