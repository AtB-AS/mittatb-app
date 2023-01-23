import {PreassignedFareProduct} from '@atb/reference-data/types';
import {ProductSelectionMode} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
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
