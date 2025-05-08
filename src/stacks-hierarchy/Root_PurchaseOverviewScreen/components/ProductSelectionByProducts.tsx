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
} from '@atb/modules/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {
  HeaderSectionItem,
  RadioGroupSection,
  Section,
} from '@atb/components/sections';
import {useTicketingContext} from '@atb/ticketing';
import {ProductDescriptionToggle} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ProductDescriptionToggle';
import {usePreferencesContext} from '@atb/modules/preferences';
import {ContentHeading} from '@atb/components/heading';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {
  type PurchaseSelectionType,
  usePurchaseSelectionBuilder,
} from '@atb/modules/purchase-selection';

type ProductSelectionByProductsProps = {
  selection: PurchaseSelectionType;
  setSelection: (s: PurchaseSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelectionByProducts({
  selection,
  setSelection,
  style,
}: ProductSelectionByProductsProps) {
  const {t, language} = useTranslation();
  const {preassignedFareProducts} = useFirestoreConfigurationContext();
  const {customerProfile} = useTicketingContext();
  const {hideProductDescriptions} = usePreferencesContext().preferences;
  const selectionBuilder = usePurchaseSelectionBuilder();

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
            onSelect={(p) => {
              const newSelection = selectionBuilder
                .fromSelection(selection)
                .product(p)
                .build();
              setSelection(newSelection);
            }}
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
