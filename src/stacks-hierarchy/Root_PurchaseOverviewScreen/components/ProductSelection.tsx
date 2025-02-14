import {ProductSelectionByAlias} from './ProductSelectionByAlias';
import {ProductSelectionByProducts} from './ProductSelectionByProducts';
import {StyleProp, ViewStyle} from 'react-native';
import {useThemeContext} from '@atb/theme';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';

type ProductSelectionProps = {
  selection: PurchaseSelectionType;
  setSelection: (s: PurchaseSelectionType) => void;
  style?: StyleProp<ViewStyle>;
};

export function ProductSelection({
  selection,
  setSelection,
  style,
}: ProductSelectionProps) {
  const {theme} = useThemeContext();

  switch (selection.fareProductTypeConfig.configuration.productSelectionMode) {
    case 'product':
      return (
        <ProductSelectionByProducts
          selection={selection}
          setSelection={setSelection}
          style={style}
        />
      );
    case 'productAlias':
    case 'duration':
      return (
        <ProductSelectionByAlias
          color={theme.color.interactive[2]}
          selection={selection}
          setSelection={setSelection}
          style={style}
        />
      );
    case 'none':
    default:
      return null;
  }
}
