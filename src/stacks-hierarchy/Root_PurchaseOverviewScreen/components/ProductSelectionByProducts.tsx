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
import {ThemeText} from '@atb/components/text';
import {FareProductTypeConfig} from '@atb/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {StyleSheet} from '@atb/theme';
import {RadioGroupSection, Section} from '@atb/components/sections';

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
  const styles = useStyles();

  const selectableProducts = preassignedFareProducts
    .filter(productIsSellableInApp)
    .filter((p) => p.type === selectedProduct.type);
  const [selected, setProduct] = useState(selectedProduct);

  const title = useTextForLanguage(
    fareProductTypeConfig.configuration.productSelectionTitle,
  );

  return (
    <View style={style}>
      <ThemeText type="body__secondary" color="secondary" style={styles.title}>
        {title || t(PurchaseOverviewTexts.productSelection.title)}
      </ThemeText>
      <Section>
        <RadioGroupSection<PreassignedFareProduct>
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
          color="interactive_1"
          accessibilityHint={t(
            PurchaseOverviewTexts.productSelection.a11yTitle,
          )}
        />
      </Section>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  title: {
    marginBottom: theme.spacings.medium,
  },
}));
