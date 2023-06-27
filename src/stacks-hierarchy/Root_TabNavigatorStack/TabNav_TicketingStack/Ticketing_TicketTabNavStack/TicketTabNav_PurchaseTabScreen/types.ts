import {PreassignedFareProduct, TariffZone} from '@atb/reference-data/types';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';

export type RecentFareContract = {
  /**
   * An id created from the underlying fields. Can be used to check for uniques
   * and as react key.
   */
  id: string;
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
};
