import React, {forwardRef, useCallback, useMemo, useState} from 'react';
import {LayoutChangeEvent, View} from 'react-native';
import * as Sections from '@atb/components/sections';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {ProductTexts, useTranslation} from '@atb/translations';
import {StyleSheet, useTheme} from '@atb/theme';
import Header from '@atb/components/screen-header';
import Button from '@atb/components/button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CustomBackdrop from '@atb/screens/Ticketing/Purchase/Product/CustomBackdrop';

type Props = {
  preassignedFareProduct: PreassignedFareProduct;
  onSave: (product: PreassignedFareProduct) => void;
  onClose: () => void;
};

const ProductBottomSheet = forwardRef<BottomSheet, Props>(
  ({preassignedFareProduct, onSave, onClose}, ref) => {
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

    const {snapPoints, layoutChangeListener} = usePopupDynamicHeight();

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={CustomBackdrop}
        handleComponent={null}
      >
        <BottomSheetView
          style={{
            ...styles.bottomSheet,
            paddingBottom: Math.max(safeAreBottom, theme.spacings.medium),
          }}
          onLayout={layoutChangeListener}
        >
          <Header
            title={t(ProductTexts.header.title)}
            leftButton={{
              type: 'cancel',
              onPress: onClose,
            }}
          />
          <View style={styles.sections}>
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
            onPress={() => onSave(selectedProduct)}
          />
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

const usePopupDynamicHeight = () => {
  const [contentHeight, setContentHeight] = useState<string | number>(0);
  const layoutChangeListener = ({nativeEvent}: LayoutChangeEvent) => {
    setContentHeight(nativeEvent.layout.height);
  };
  const snapPoints = useMemo(() => [-1, contentHeight], [contentHeight]);
  return {
    snapPoints,
    layoutChangeListener,
  };
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sections: {
    marginVertical: theme.spacings.medium,
  },
  bottomSheet: {
    padding: theme.spacings.medium,
    backgroundColor: theme.background.level2,
    borderTopLeftRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
  },
}));

export default ProductBottomSheet;
