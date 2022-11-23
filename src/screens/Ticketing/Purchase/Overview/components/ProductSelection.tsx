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
import {StyleSheet} from '@atb/theme';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import InfoToggle from './InfoToggle';
import * as Sections from '../../../../../components/sections';

type ProductSelectionProps = {
  selectedProduct: PreassignedFareProduct;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export default function ProductSelection({
  selectedProduct,
  setSelectedProduct,
  style,
}: ProductSelectionProps) {
  const {t, language} = useTranslation();
  const {preassignedFareProducts} = useFirestoreConfiguration();

  const selectableProducts = preassignedFareProducts
    .filter(productIsSellableInApp)
    .filter((p) => p.type === selectedProduct.type);

  const [selected, setProduct] = useState(selectableProducts[0]);

  return (
    <View style={style}>
      <InfoToggle title={t(PurchaseOverviewTexts.productSelection.title)} />
      <Sections.Section>
        <Sections.RadioSection<PreassignedFareProduct>
          items={selectableProducts}
          keyExtractor={(u) => u.id}
          itemToText={(fp) => getReferenceDataName(fp, language)}
          hideSubtext={false}
          itemToSubtext={(fp) => getReferenceDataName(fp, language)}
          selected={selected}
          onSelect={(fp) => {
            setProduct(fp)
            setSelectedProduct(fp)
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
