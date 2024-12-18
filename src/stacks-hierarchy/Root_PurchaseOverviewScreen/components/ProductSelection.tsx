import {PreassignedFareProduct} from '@atb/configuration';
import {FareProductTypeConfig} from '@atb/configuration';
import {ProductSelectionByAlias} from './ProductSelectionByAlias';
import {ProductSelectionByProducts} from './ProductSelectionByProducts';
import {StyleProp, ViewStyle} from 'react-native';
import {useThemeContext} from '@atb/theme';

type ProductSelectionProps = {
  preassignedFareProduct: PreassignedFareProduct;
  fareProductTypeConfig: FareProductTypeConfig;
  setSelectedProduct: (product: PreassignedFareProduct) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelection({
  preassignedFareProduct,
  fareProductTypeConfig,
  setSelectedProduct,
  style,
}: ProductSelectionProps) {
  const {theme} = useThemeContext();

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
          color={theme.color.interactive[2]}
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
