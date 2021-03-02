import React, {useRef, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {View} from 'react-native';
import {Portal} from 'react-native-portalize';
import * as Sections from '@atb/components/sections';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {ProductTexts, useTranslation} from '@atb/translations';
import {Edit} from '@atb/assets/svg/icons/actions';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {StyleSheet, useTheme} from '@atb/theme';
import Header from '@atb/components/screen-header';
import Button from '@atb/components/button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  onSave: (product: PreassignedFareProduct) => void;
};

const ProductLinkAndPopup = ({preassignedFareProduct, onSave}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  const {bottom: safeAreBottom} = useSafeAreaInsets();

  const [selectedProduct, setSelectedProduct] = useState(
    preassignedFareProduct,
  );
  const {preassigned_fare_products: products} = useRemoteConfig();
  const selectableProducts = products.filter(
    (p) => p.type === selectedProduct.type,
  );

  const modalizeRef = useRef<Modalize>(null);
  const openPopup = () => {
    modalizeRef.current?.open();
  };
  const saveAndClose = () => {
    onSave(selectedProduct);
    modalizeRef.current?.close();
  };

  return (
    <View>
      <Sections.LinkItem
        text={getReferenceDataName(preassignedFareProduct, language)}
        onPress={openPopup}
        disabled={selectableProducts.length <= 1}
        icon={<ThemeIcon svg={Edit} />}
      />
      <Portal>
        <Modalize
          adjustToContentHeight={true}
          withHandle={false}
          ref={modalizeRef}
          modalStyle={styles.modal}
        >
          <Header
            title={t(ProductTexts.header.title)}
            leftButton={{
              type: 'cancel',
              onPress: () => modalizeRef.current?.close(),
            }}
          />
          <View style={styles.sections}>
            <Sections.Section>
              <Sections.RadioSection<PreassignedFareProduct>
                items={selectableProducts}
                itemToText={(p) => getReferenceDataName(p, language)}
                keyExtractor={(p) => Math.random().toString()}
                onSelect={setSelectedProduct}
                selected={selectedProduct}
              />
            </Sections.Section>
          </View>
          <View
            style={{
              paddingBottom: Math.max(safeAreBottom, theme.spacings.medium),
            }}
          >
            <Button
              color="primary_2"
              text={t(ProductTexts.saveButton.text)}
              onPress={saveAndClose}
            />
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sections: {
    marginVertical: theme.spacings.medium,
  },
  modal: {
    backgroundColor: theme.background.level2,
    padding: theme.spacings.medium,
  },
}));

export default ProductLinkAndPopup;
