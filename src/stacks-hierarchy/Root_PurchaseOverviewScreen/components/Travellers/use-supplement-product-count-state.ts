import {useState} from 'react';
import type {SupplementProductsWithCount} from '@atb/modules/fare-contracts';
import {useSelectableSupplementProducts} from '@atb/modules/purchase-selection';
import type {SupplementProduct} from '@atb-as/config-specs';
import type {SupplementProductState} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/types';

export function useSupplementCountProductState(): SupplementProductState {
  const initialSupplementProducts = useSelectableSupplementProducts();
  const [state, setState] = useState<SupplementProductsWithCount>(
    mapToInitialSupplementProductsWithCount(initialSupplementProducts),
  );

  const increment = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        count: (prevState[id]?.count ?? 0) + 1,
      },
    }));
  };

  const decrement = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        count: Math.max((prevState[id]?.count ?? 0) - 1, 0),
      },
    }));
  };

  return {
    supplementProductsWithCount: state,
    increment,
    decrement,
  };
}

function mapToInitialSupplementProductsWithCount(
  supplementProducts: SupplementProduct[],
): SupplementProductsWithCount {
  return supplementProducts.reduce((acc, product) => {
    acc[product.id] = {...product, count: 0};
    return acc;
  }, {} as SupplementProductsWithCount);
}
