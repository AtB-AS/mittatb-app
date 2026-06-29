import {ProductSelectionByAlias} from './ProductSelectionByAlias';
import {ProductSelectionByProducts} from './ProductSelectionByProducts';
import {StyleProp, ViewStyle} from 'react-native';
import {useThemeContext} from '@atb/theme';
import type {
  PurchaseSelectionBuildResult,
  PurchaseSelectionType,
} from '@atb/modules/purchase-selection';

type ProductSelectionProps = {
  selection: PurchaseSelectionType;
  onProductChange: (result: PurchaseSelectionBuildResult) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelection({
  selection,
  onProductChange,
  style,
}: ProductSelectionProps) {
  const {theme} = useThemeContext();

  switch (selection.fareProductTypeConfig.configuration.productSelectionMode) {
    case 'product':
      return (
        <ProductSelectionByProducts
          selection={selection}
          onProductChange={onProductChange}
          style={style}
        />
      );
    case 'productAlias':
    case 'duration':
      return (
        <ProductSelectionByAlias
          color={theme.color.interactive[2]}
          selection={selection}
          onProductChange={onProductChange}
          style={style}
        />
      );
    case 'none':
    default:
      return null;
  }
}
