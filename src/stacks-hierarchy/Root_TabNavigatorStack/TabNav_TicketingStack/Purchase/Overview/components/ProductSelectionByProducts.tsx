import React, {useState} from 'react';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {
  getReferenceDataName,
  productIsSellableInApp,
} from '@atb/reference-data/utils';
import {StyleProp, View, ViewStyle} from 'react-native';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import * as Sections from '../../../../../../components/sections';

type ProductSelectionByProductsProps = {
  selectedProduct: PreassignedFareProduct;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export default function ProductSelectionByProducts({
  selectedProduct,
  setSelectedProduct,
  style,
}: ProductSelectionByProductsProps) {
  const {t, language} = useTranslation();
  const {preassignedFareProducts} = useFirestoreConfiguration();

  const selectableProducts = preassignedFareProducts
    .filter(productIsSellableInApp)
    .filter((p) => p.type === selectedProduct.type);
  const [selected, setProduct] = useState(selectedProduct);

  return (
    <View style={style}>
      <Sections.Section>
        <Sections.RadioGroupSection<PreassignedFareProduct>
          items={selectableProducts}
          keyExtractor={(u) => u.id}
          itemToText={(fp) => getReferenceDataName(fp, language)}
          hideSubtext={false}
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
      </Sections.Section>
    </View>
  );
}
