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

  /**
   * An optional user profile white list containing the userTypeString of the
   * user profiles that should be allowed. If no whitelist is defined, then all
   * user profiles should be selectable. This should preferably later be
   * modelled into the reference data with Entur as the source.
   */
  userProfilesWhiteList?: string[];
};

export const getPurchaseFlow = (
  product: PreassignedFareProduct,
): PurchaseFlow => {
  if (product.type === 'period') {
    return {
      travellerSelectionMode: 'single',
      travelDateSelectionEnabled: true,
      userProfilesWhiteList: ['ADULT', 'SENIOR', 'CHILD', 'STUDENT'],
    };
  } else {
    return {
      travellerSelectionMode: 'multiple',
      travelDateSelectionEnabled: false,
    };
  }
};
