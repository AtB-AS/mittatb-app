import React, {forwardRef, useState} from 'react';
import {View} from 'react-native';
import Header from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import * as Sections from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {ProductTexts, useTranslation} from '@atb/translations';
import Button from '@atb/components/button';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {PreassignedFareProduct} from '@atb/reference-data/types';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  close: () => void;
  save: (preassignedFareProduct: PreassignedFareProduct) => void;
};

const ProductSheet = forwardRef<ScrollView, Props>(
  ({preassignedFareProduct, close, save}, focusRef) => {
    const styles = useStyles();
    const {t, language} = useTranslation();

    const {
      preassigned_fare_products: preassignedFareProducts,
    } = useRemoteConfig();

    const [selectedProduct, setSelectedProduct] = useState(
      preassignedFareProduct,
    );

    const selectableProducts = preassignedFareProducts.filter(
      (p) => p.type === selectedProduct.type,
    );

    return (
      <View>
        <Header
          title={t(ProductTexts.header.title)}
          leftButton={{type: 'cancel', onPress: close}}
        />

        <ScrollView style={styles.productsSection} ref={focusRef}>
          <Sections.Section>
            <Sections.RadioSection<PreassignedFareProduct>
              items={selectableProducts}
              itemToText={(p) => getReferenceDataName(p, language)}
              keyExtractor={(p) => p.id}
              onSelect={setSelectedProduct}
              selected={selectedProduct}
            />
          </Sections.Section>
        </ScrollView>

        <View style={styles.saveButton}>
          <Button
            color="primary_2"
            text={t(ProductTexts.primaryButton.text)}
            onPress={() => {
              save(selectedProduct);
              close();
            }}
          />
        </View>
      </View>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  productsSection: {
    margin: theme.spacings.medium,
  },
  saveButton: {
    marginHorizontal: theme.spacings.medium,
  },
}));

export default ProductSheet;
