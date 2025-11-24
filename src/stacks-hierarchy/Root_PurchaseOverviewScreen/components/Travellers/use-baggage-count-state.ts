import {useState} from 'react';
import type {BaggageProductWithCount} from '@atb/modules/fare-contracts';
import {
  type PurchaseSelectionType,
  useSelectableBaggageProducts,
} from '@atb/modules/purchase-selection';
import type {BaggageCountState} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/types';
import {BaggageProduct} from '@atb/modules/configuration';

export function useBaggageCountState(
  selection: PurchaseSelectionType,
): BaggageCountState {
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
