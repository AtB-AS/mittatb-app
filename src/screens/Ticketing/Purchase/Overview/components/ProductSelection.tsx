import {PreassignedFareProduct} from '@atb/reference-data/types';
import {ProductSelectionMode} from '@atb/screens/Ticketing/FareContracts/utils';
import ProductSelectionByDuration from './ProductSelectionByDuration';
import ProductSelectionByProducts from './ProductSelectionByProducts';
import {StyleProp, ViewStyle} from 'react-native';

type ProductSelectionProps = {
  preassignedFareProduct: PreassignedFareProduct;
  selectionMode: ProductSelectionMode;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export default function ProductSelection({
  preassignedFareProduct,
  selectionMode,
  setSelectedProduct,
  style,
}: ProductSelectionProps) {
  if (selectionMode === 'none') {
    return <></>;
  }

  return (
    <>
      {selectionMode === 'product' && (
        <ProductSelectionByProducts
          selectedProduct={preassignedFareProduct}
          setSelectedProduct={setSelectedProduct}
          style={style}
        />
      )}

      {selectionMode === 'duration' && (
        <ProductSelectionByDuration
          color="interactive_2"
          selectedProduct={preassignedFareProduct}
          setSelectedProduct={setSelectedProduct}
          style={style}
        />
      )}
    </>
  );
}
