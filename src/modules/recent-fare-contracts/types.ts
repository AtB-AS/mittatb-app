import {
  PointToPointValidity,
  PreassignedFareProduct,
  FareZone,
} from '@atb/modules/configuration';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {TravelRightDirection} from '@atb-as/utils';

export type RecentFareContractType = {
  /**
   * An id created from the underlying fields. Can be used to check for uniques
   * and as react key.
   */
  id: string;
  preassignedFareProduct: PreassignedFareProduct;
  fromFareZone?: FareZone;
  toFareZone?: FareZone;
  direction?: TravelRightDirection;
  pointToPointValidity?: PointToPointValidity;
  userProfilesWithCount: UserProfileWithCount[];
};
