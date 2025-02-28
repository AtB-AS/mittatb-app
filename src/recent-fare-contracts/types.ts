import {
  PointToPointValidity,
  PreassignedFareProduct,
  TariffZone,
} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {TravelRightDirection} from '@atb-as/utils';

export type RecentFareContractType = {
  /**
   * An id created from the underlying fields. Can be used to check for uniques
   * and as react key.
   */
  id: string;
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  direction?: TravelRightDirection;
  pointToPointValidity?: PointToPointValidity;
  userProfilesWithCount: UserProfileWithCount[];
};
