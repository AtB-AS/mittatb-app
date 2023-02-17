import {PreassignedFareProduct} from '@atb/reference-data/types';
import {FareProductTypeConfig} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import ProductSelectionByAlias from './ProductSelectionByAlias';
import ProductSelectionByProducts from './ProductSelectionByProducts';
import {StyleProp, ViewStyle} from 'react-native';

type ProductSelectionProps = {
  preassignedFareProduct: PreassignedFareProduct;
  fareProductTypeConfig: FareProductTypeConfig;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export default function ProductSelection({
  preassignedFareProduct,
  fareProductTypeConfig,
  setSelectedProduct,
  style,
}: ProductSelectionProps) {
  switch (fareProductTypeConfig.configuration.productSelectionMode) {
    case 'product':
      return (
        <ProductSelectionByProducts
          selectedProduct={preassignedFareProduct}
          fareProductTypeConfig={fareProductTypeConfig}
          setSelectedProduct={setSelectedProduct}
          style={style}
        />
      );
    case 'productAlias':
    case 'duration':
      return (
        <ProductSelectionByAlias
          color="interactive_2"
          selectedProduct={preassignedFareProduct}
          fareProductTypeConfig={fareProductTypeConfig}
          setSelectedProduct={setSelectedProduct}
          style={style}
        />
      );
    case 'none':
    default:
      return null;
  }
}
