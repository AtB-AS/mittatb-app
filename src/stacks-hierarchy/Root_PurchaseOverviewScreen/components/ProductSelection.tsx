import {PreassignedFareProduct} from '@atb/configuration';
import {ProductSelectionByAlias} from './ProductSelectionByAlias';
import {ProductSelectionByProducts} from './ProductSelectionByProducts';
import {StyleProp, ViewStyle} from 'react-native';
import {useThemeContext} from '@atb/theme';
import type {PurchaseSelectionType} from '@atb/purchase-selection';

type ProductSelectionProps = {
  selection: PurchaseSelectionType;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelection({
  selection,
  setSelectedProduct,
  style,
}: ProductSelectionProps) {
  const {theme} = useThemeContext();

  switch (selection.fareProductTypeConfig.configuration.productSelectionMode) {
    case 'product':
      return (
        <ProductSelectionByProducts
          selection={selection}
          setSelectedProduct={setSelectedProduct}
          style={style}
        />
      );
    case 'productAlias':
    case 'duration':
      return (
        <ProductSelectionByAlias
          color={theme.color.interactive[2]}
          selection={selection}
          setSelectedProduct={setSelectedProduct}
          style={style}
        />
      );
    case 'none':
    default:
      return null;
  }
}
