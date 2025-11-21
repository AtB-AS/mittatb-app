import {useState} from 'react';
import type {
  BaggageProduct,
  BaggageProductWithCount,
} from '@atb/modules/fare-contracts';
import {
  type PurchaseSelectionType,
  useSelectableBaggageProducts,
} from '@atb/modules/purchase-selection';
import type {BaggageProductState} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/types';

export function useBaggageCountProductState(
  selection: PurchaseSelectionType,
): BaggageProductState {
  const selectableBaggageProducts = useSelectableBaggageProducts(selection);
  const [state, setState] = useState<BaggageProductWithCount[]>(
    mapToInitialBaggageProductsWithCount(
      selectableBaggageProducts,
      selection.baggageProductsWithCount,
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
    baggageProductsWithCount: state,
    increment,
    decrement,
  };
}

function mapToInitialBaggageProductsWithCount(
  selectable: BaggageProduct[],
  selectedBaggageProducts: BaggageProductWithCount[] = [],
): BaggageProductWithCount[] {
  return selectable.map((selectableProduct) => {
    return {
      ...selectableProduct,
      count:
        selectedBaggageProducts.find((sp) => sp.id === selectableProduct.id)
          ?.count ?? 0,
    };
  });
}
