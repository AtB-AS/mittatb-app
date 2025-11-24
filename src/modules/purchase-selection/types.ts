import {
  FareProductTypeConfig,
  PreassignedFareProduct,
  UserProfile,
  FareZone,
} from '@atb/modules/configuration';
import {
  UserProfileWithCount,
  BaggageProductWithCount,
} from '@atb/modules/fare-contracts';
import {FareZoneWithMetadata} from '@atb/fare-zones-selector';
import {StopPlaceFragmentWithIsFree} from '@atb/modules/harbors';
import {CustomerProfile} from '@atb/modules/ticketing';
import {Coordinates} from '@atb/utils/coordinates';
import type {Leg} from '@atb/api/types/trips';

export type PurchaseSelectionType = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  userProfilesWithCount: UserProfileWithCount[];
  baggageProductsWithCount: BaggageProductWithCount[];
  stopPlaces:
    | {
        from: StopPlaceFragmentWithIsFree | undefined;
        to: StopPlaceFragmentWithIsFree | undefined;
      }
    | undefined;
  zones:
    | {
        from: FareZoneWithMetadata;
        to: FareZoneWithMetadata;
      }
    | undefined;
  travelDate: string | undefined;
  legs: Leg[];
  isOnBehalfOf: boolean;
};

/**
 * The purchase selection builder input contains all the relevant data needed
 * for the purchase selection business logic.
 */
export type PurchaseSelectionBuilderInput = {
  userProfiles: UserProfile[];
  preassignedFareProducts: PreassignedFareProduct[];
  fareZones: FareZone[];
  fareProductTypeConfigs: FareProductTypeConfig[];
  customerProfile: CustomerProfile | undefined;
  appVersion: string;
  defaultUserTypeString: string | undefined;
  currentCoordinates: Coordinates | undefined;
};

export type PurchaseSelectionEmptyBuilder = {
  /**
   * Create a purchase selection builder for the given config type. Will apply
   * the appropriate default values for the purchase selection fields.
   */
  forType: (type: string) => PurchaseSelectionBuilder;
  /**
   * Create a purchase selection builder based on the given purchase selection
   * to be able to modify it further. If the given purchase selection is
   * invalid, then a purchase selection builder will be created based on the
   * config type of the given selection.
   */
  fromSelection: (s: PurchaseSelectionType) => PurchaseSelectionBuilder;
};

export type PurchaseSelectionBuilder = {
  /**
   * Apply the given product to the purchase selection. If the given product is
   * not applicable the purchase selection will stay unmodified. Change of
   * product can modify profile or zones if the new product has limitations
   * which makes the currently selected profile/zone not applicable.
   */
  product: (p: PreassignedFareProduct) => PurchaseSelectionBuilder;

  /**
   * Apply the given from zone to the purchase selection. If the given zone is
   * not applicable the purchase selection will stay unmodified.
   */
  fromZone: (f: FareZoneWithMetadata) => PurchaseSelectionBuilder;

  /**
   * Apply the given to zone to the purchase selection. If the given zone is
   * not applicable the purchase selection will stay unmodified.
   */
  toZone: (t: FareZoneWithMetadata) => PurchaseSelectionBuilder;

  /**
   * Apply the given from stop place to the purchase selection. If the given
   * stop place is not applicable the purchase selection will stay unmodified.
   */
  fromStopPlace: (f?: StopPlaceFragmentWithIsFree) => PurchaseSelectionBuilder;

  /**
   * Apply the given to stop place to the purchase selection. If the given stop
   * place is not applicable the purchase selection will stay unmodified.
   */
  toStopPlace: (t?: StopPlaceFragmentWithIsFree) => PurchaseSelectionBuilder;

  /**
   * Apply the given user profiles with count to the purchase selection. If one
   * of the given user profiles are not applicable the purchase selection will
   * stay unmodified.
   */
  userProfiles: (u: UserProfileWithCount[]) => PurchaseSelectionBuilder;

  /**
   * Apply the given baggage products with count to the purchase selection.
   * No checks regarding the applicability of the baggage products to the
   * other fields in the production, but such validation could be implemented.
   */
  baggageProducts: (b: BaggageProductWithCount[]) => PurchaseSelectionBuilder;

  /**
   * Apply the given travel date to the purchase selection. If the given date is
   * invalid the purchase selection will stay unmodified.
   */
  date: (d?: string) => PurchaseSelectionBuilder;

  /**
   * Apply the given legs to the purchase selection. If the given legs are not
   * on the same date as the travel date, the purchase selection will stay
   * unmodified.
   */
  legs: (l: Leg[]) => PurchaseSelectionBuilder;

  /**
   * Apply isOnBehalfOf flag to the purchase selection.
   * @param isOnBehalfOf
   */
  isOnBehalfOf: (isOnBehalfOf: boolean) => PurchaseSelectionBuilder;

  /**
   * Retrieve the built purchase selection. It is the purchase selection that
   * should be passed around between components and screens, not the builder.
   */
  build: () => PurchaseSelectionType;
};
