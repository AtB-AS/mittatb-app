import React, {useState} from 'react';
import {
  getTextForLanguage,
  Language,
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
  const {preassignedFareProducts} = useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();
  const {hideProductDescriptions} = usePreferenceItems();

  const selectableProducts = preassignedFareProducts
    .filter((product) => isProductSellableInApp(product, customerProfile))
    .filter((product) => product.type === selectedProduct.type);
  const [selected, setProduct] = useState(selectedProduct);

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
          <Section>
            <RadioGroupSection<PreassignedFareProduct>
              items={selectableProducts}
              keyExtractor={(u) => u.id}
              itemToText={(fp) => getProductName(fp, language)}
              hideSubtext={hideProductDescriptions}
              itemToSubtext={(fp) => subText(fp)}
              selected={selected}
              onSelect={(fp) => {
                setProduct(fp);
                setSelectedProduct(fp);
              }}
              color="interactive_2"
              accessibilityHint={t(
                PurchaseOverviewTexts.productSelection.a11yTitle,
              )}
            />
          </Section>
        </>
      ) : (
        <>
          <ContentHeading text={title} />
          <Section>
            <HeaderSectionItem
              text={getProductName(selectedProduct, language)}
              subtitle={subText(selectedProduct)}
            />
          </Section>
        </>
      )}
    </View>
  );
}

/**
 * This function will return the product name to be displayed.
 *
 * If the product name has alias set, then show the alias,
 * otherwise get the regular product name.
 *
 * @param fareProduct product to be displayed
 * @param language current language of the app
 * @returns product name to be displayed, string
 */
function getProductName(
  fareProduct: PreassignedFareProduct,
  language: Language,
): string {
  const aliasText = fareProduct.productAlias
    ? getTextForLanguage(fareProduct.productAlias, language)
    : undefined;

  const productName = aliasText
    ? aliasText
    : getReferenceDataName(fareProduct, language);

  return productName;
}
