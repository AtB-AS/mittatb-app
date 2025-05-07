import {
  FareProductTypeConfig,
  PreassignedFareProduct,
  UserProfile,
  TariffZone,
} from '@atb/modules/configuration';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StopPlaceFragmentWithIsFree} from '@atb/harbors/types';
import {CustomerProfile} from '@atb/ticketing';
import {Coordinates} from '@atb/utils/coordinates';

export type PurchaseSelectionType = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  userProfilesWithCount: UserProfileWithCount[];
  stopPlaces:
    | {
        from: StopPlaceFragmentWithIsFree | undefined;
        to: StopPlaceFragmentWithIsFree | undefined;
      }
    | undefined;
  zones:
    | {
        from: TariffZoneWithMetadata;
        to: TariffZoneWithMetadata;
      }
    | undefined;
  travelDate: string | undefined;
};

/**
 * The purchase selection builder input contains all the relevant data needed
 * for the purchase selection business logic.
 */
export type PurchaseSelectionBuilderInput = {
  userProfiles: UserProfile[];
  preassignedFareProducts: PreassignedFareProduct[];
  tariffZones: TariffZone[];
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
  fromZone: (f: TariffZoneWithMetadata) => PurchaseSelectionBuilder;

  /**
   * Apply the given to zone to the purchase selection. If the given zone is
   * not applicable the purchase selection will stay unmodified.
   */
  toZone: (t: TariffZoneWithMetadata) => PurchaseSelectionBuilder;

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
   * Apply the given travel date to the purchase selection. If the given date is
   * invalid the purchase selection will stay unmodified.
   */
  date: (d?: string) => PurchaseSelectionBuilder;

  /**
   * Retrieve the built purchase selection. It is the purchase selection that
   * should be passed around between components and screens, not the builder.
   */
  build: () => PurchaseSelectionType;
};
