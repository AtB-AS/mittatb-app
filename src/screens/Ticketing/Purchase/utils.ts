import {PreassignedFareProduct} from '@atb/reference-data/types';

export type PurchaseFlow = {
  /**
   * Whether the traveller selection should allow a single traveller or
   * multiple travellers to be selected.
   */
  travellerSelectionMode: 'single' | 'multiple';

  /**
   * Whether the customer should be able to select a future start time for the
   * ticket.
   */
  travelDateSelectionEnabled: boolean;
};

export const getPurchaseFlow = (
  product: PreassignedFareProduct,
): PurchaseFlow => {
  if (product.type === 'period' || product.type === 'hour24') {
    return {
      travellerSelectionMode: 'single',
      travelDateSelectionEnabled: true,
    };
  } else {
    return {
      travellerSelectionMode: 'multiple',
      travelDateSelectionEnabled: false,
    };
  }
};
