import React, {useState} from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {
  getReferenceDataName,
  isProductSellableInApp,
} from '@atb/reference-data/utils';
import {StyleProp, View, ViewStyle} from 'react-native';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {FareProductTypeConfig} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {RadioGroupSection, Section} from '@atb/components/sections';
import {useTicketingState} from '@atb/ticketing';
import {ProductDescriptionToggle} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ProductDescriptionToggle';
import {usePreferenceItems} from '@atb/preferences';

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

  const title = useTextForLanguage(
    fareProductTypeConfig.configuration.productSelectionTitle,
  );

  return (
    <View style={style}>
      <ProductDescriptionToggle
        title={title || t(PurchaseOverviewTexts.productSelection.title)}
      />
      <Section>
        <RadioGroupSection<PreassignedFareProduct>
          items={selectableProducts}
          keyExtractor={(u) => u.id}
          itemToText={(fp) => getReferenceDataName(fp, language)}
          hideSubtext={hideProductDescriptions}
          itemToSubtext={(fp) => {
            const descriptionMessage = getTextForLanguage(
              fp.description ?? [],
              language,
            );
            const warningMessage = getTextForLanguage(
              fp.warningMessage,
              language,
            );
            if (descriptionMessage && warningMessage) {
              return `${descriptionMessage}\n${warningMessage}`;
            }

            return descriptionMessage ?? warningMessage;
          }}
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
    </View>
  );
}
