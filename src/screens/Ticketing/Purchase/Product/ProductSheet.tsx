import React, {forwardRef, useState} from 'react';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {StyleSheet} from '@atb/theme';
import * as Sections from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {
  ProductTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import Button from '@atb/components/button';
import {
  getReferenceDataName,
  productIsSellableInApp,
} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  close: () => void;
  save: (preassignedFareProduct: PreassignedFareProduct) => void;
};

const ProductSheet = forwardRef<ScrollView, Props>(
  ({preassignedFareProduct, close, save}, focusRef) => {
    const styles = useStyles();
    const {t, language} = useTranslation();

    const {preassignedFareproducts} = useFirestoreConfiguration();

    const [selectedProduct, setSelectedProduct] = useState(
      preassignedFareProduct,
    );

    const selectableProducts = preassignedFareproducts
      .filter(productIsSellableInApp)
      .filter((p) => p.type === selectedProduct.type);

    return (
      <BottomSheetContainer>
        <ScreenHeaderWithoutNavigation
          title={t(ProductTexts.header.title)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
            testID: 'cancelButton',
          }}
          color={'background_2'}
          setFocusOnLoad={false}
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

        <FullScreenFooter>
          <Button
            interactiveColor="interactive_0"
            text={t(ProductTexts.primaryButton.text)}
            onPress={() => {
              save(selectedProduct);
              close();
            }}
            testID="saveTicketTypeButton"
          />
        </FullScreenFooter>
      </BottomSheetContainer>
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
