import {useState} from 'react';
import type {SupplementProductWithCount} from '@atb/modules/fare-contracts';
import {
  type PurchaseSelectionType,
  useSelectableSupplementProducts,
} from '@atb/modules/purchase-selection';
import type {SupplementProduct} from '@atb-as/config-specs';
import type {SupplementProductState} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/types';

export function useSupplementCountProductState(
  selection: PurchaseSelectionType,
): SupplementProductState {
  const selectableSupplementProducts =
    useSelectableSupplementProducts(selection);
  const [state, setState] = useState<SupplementProductWithCount[]>(
    mapToInitialSupplementProductsWithCount(
      selectableSupplementProducts,
      selection.supplementProductsWithCount,
    ),
  );

  const increment = (id: string) => {
    setState((prevState) =>
      prevState.map((item) =>
        item.id === id ? {...item, count: (item.count ?? 0) + 1} : item,
      ),
    );
  };

  const decrement = (id: string) => {
    setState((prevState) =>
      prevState.map((item) =>
        item.id === id
          ? {...item, count: Math.max((item.count ?? 0) - 1, 0)}
          : item,
      ),
    );
  };

  return {
    supplementProductsWithCount: state,
    increment,
    decrement,
  };
}

function mapToInitialSupplementProductsWithCount(
  selectable: SupplementProduct[],
  selectedProducts: SupplementProductWithCount[] = [],
): SupplementProductWithCount[] {
  return selectable.map((selectableProduct) => {
    return {
      ...selectableProduct,
      count:
        selectedProducts.find((sp) => sp.id === selectableProduct.id)?.count ??
        0,
    };
  });
}
