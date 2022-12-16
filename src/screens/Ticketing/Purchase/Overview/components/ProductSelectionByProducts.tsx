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
import InfoToggle from './InfoToggle';
import * as Sections from '../../../../../components/sections';
import {usePreferences} from '@atb/preferences';

type ProductSelectionByProductsProps = {
  selectedProduct: PreassignedFareProduct;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  restrictionMessage: string | undefined;
  style?: StyleProp<ViewStyle>;
};

export default function ProductSelectionByProducts({
  selectedProduct,
  setSelectedProduct,
  restrictionMessage,
  style,
}: ProductSelectionByProductsProps) {
  const {t, language} = useTranslation();
  const {preassignedFareProducts} = useFirestoreConfiguration();

  const selectableProducts = preassignedFareProducts
    .filter(productIsSellableInApp)
    .filter((p) => p.type === selectedProduct.type);
  const {
    preferences: {hideTravellerDescriptions},
  } = usePreferences();
  const [selected, setProduct] = useState(selectableProducts[0]);
  const showInfoToggle = selectableProducts.some((p) => p.description);

  return (
    <View style={style}>
      {showInfoToggle && (
        <InfoToggle
          title={t(PurchaseOverviewTexts.productSelection.title)}
          accessibilityLabel={t(
            PurchaseOverviewTexts.infoToggle.productTicketA11yLabel,
          )}
        />
      )}
      <Sections.Section>
        <Sections.RadioSection<PreassignedFareProduct>
          items={selectableProducts}
          keyExtractor={(u) => u.id}
          itemToText={(fp) => getReferenceDataName(fp, language)}
          hideSubtext={hideTravellerDescriptions}
          itemToSubtext={(fp) =>
            getTextForLanguage(fp.description ?? [], language) ?? 'Unknow'
          }
          itemToWarningText={() => restrictionMessage}
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
