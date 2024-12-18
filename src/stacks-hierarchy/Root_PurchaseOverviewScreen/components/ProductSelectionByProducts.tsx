import React from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  PreassignedFareProduct,
  useFirestoreConfigurationContext,
  getReferenceDataName,
  isProductSellableInApp,
} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {
  HeaderSectionItem,
  RadioGroupSection,
  Section,
} from '@atb/components/sections';
import {useTicketingContext} from '@atb/ticketing';
import {ProductDescriptionToggle} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ProductDescriptionToggle';
import {usePreferencesContext} from '@atb/preferences';
import {ContentHeading} from '@atb/components/heading';
import {useThemeContext} from '@atb/theme';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import type {PurchaseSelectionType} from '@atb/purchase-selection';

type ProductSelectionByProductsProps = {
  selection: PurchaseSelectionType;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelectionByProducts({
  selection,
  setSelectedProduct,
  style,
}: ProductSelectionByProductsProps) {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[2];
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const {customerProfile} = useTicketingContext();
  const {hideProductDescriptions} = usePreferencesContext().preferences;

  const selectableProducts = preassignedFareProducts
    .filter((product) => isProductSellableInApp(product, customerProfile))
    .filter((product) => product.type === selection.preassignedFareProduct.type)
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
      selection.fareProductTypeConfig.configuration.productSelectionTitle,
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
            selected={selection.preassignedFareProduct}
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
              text={productDisplayName(selection.preassignedFareProduct)}
              subtitle={subText(selection.preassignedFareProduct)}
            />
          </Section>
        </>
      )}
    </View>
  );
}
