import React, {RefObject, useState} from 'react';
import {View} from 'react-native';
import * as Sections from '@atb/components/sections';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {ProductTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import Header from '@atb/components/screen-header';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  save: (product: PreassignedFareProduct) => void;
  close: () => void;
  focusRef: RefObject<any>;
};

const Index = ({preassignedFareProduct, save, close, focusRef}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const [selectedProduct, setSelectedProduct] = useState(
    preassignedFareProduct,
  );
  const {preassigned_fare_products: products} = useRemoteConfig();
  const selectableProducts = products.filter(
    (p) => p.type === selectedProduct.type,
  );

  const saveAndClose = () => {
    save(selectedProduct);
    close();
  };

  return (
    <>
      <Header
        title={t(ProductTexts.header.title)}
        leftButton={{
          type: 'cancel',
          onPress: close,
        }}
      />
      <View style={styles.sections} ref={focusRef}>
        <Sections.Section>
          <Sections.RadioSection<PreassignedFareProduct>
            items={selectableProducts}
            itemToText={(p) => getReferenceDataName(p, language)}
            keyExtractor={(p) => p.name.value} // Todo: use p.id
            onSelect={setSelectedProduct}
            selected={selectedProduct}
          />
        </Sections.Section>
      </View>
      <Button
        color="primary_2"
        text={t(ProductTexts.saveButton.text)}
        onPress={saveAndClose}
      />
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sections: {
    marginVertical: theme.spacings.medium,
  },
}));

export default Index;
