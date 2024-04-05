import {usePreferences} from '@atb/preferences';
import {
  PreassignedFareProduct,
  UserProfile,
  useFirestoreConfiguration,
  isProductSellableInApp,
} from '@atb/configuration';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {useTicketingState} from '@atb/ticketing';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {useDefaultTariffZone, useFilterTariffZone} from '@atb/stacks-hierarchy/utils';
import {useMemo} from 'react';
import {useDefaultPreassignedFareProduct} from '@atb/fare-contracts/utils';
import {useGetFareProductsQuery} from '@atb/ticketing/use-get-fare-products-query';

type UserProfileTypeWithCount = {
  userTypeString: string;
  count: number;
};

export function useOfferDefaults(
  preassignedFareProduct?: PreassignedFareProduct,
  selectableProductType?: string,
  userProfilesWithCount?: UserProfileWithCount[],
  fromPlace?: TariffZoneWithMetadata | StopPlaceFragment,
  toPlace?: TariffZoneWithMetadata | StopPlaceFragment,
) {
  const {data: fareProducts} = useGetFareProductsQuery();
  const {tariffZones, userProfiles} = useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();

  // Get default PreassignedFareProduct
  const productType = preassignedFareProduct?.type ?? selectableProductType;
  const selectableProducts = fareProducts
    .filter((product) => isProductSellableInApp(product, customerProfile))
    .filter((product) => product.type === productType);
  const defaultFareProduct =
    useDefaultPreassignedFareProduct(selectableProducts);
  const defaultPreassignedFareProduct =
    preassignedFareProduct ?? defaultFareProduct;

  // Check for whitelisted zones
  const allowedTariffZones = defaultPreassignedFareProduct.limitations.tariffZoneRefs ?? [];
  const usableTariffZones = useFilterTariffZone(tariffZones, allowedTariffZones);

  // Get default TariffZones
  const defaultTariffZone = useDefaultTariffZone(usableTariffZones);
  const defaultFromPlace = fromPlace ?? defaultTariffZone;
  const defaultToPlace = toPlace ?? defaultTariffZone;

  // Get default SelectableTravellers
  const {
    preferences: {defaultUserTypeString},
  } = usePreferences();

  const defaultSelection = useMemo(() => {
    if (!userProfilesWithCount?.length) {
      const defaultPreSelectedUser: UserProfileTypeWithCount = {
        userTypeString: defaultUserTypeString ?? userProfiles[0].userTypeString,
        count: 1,
      };
      return [defaultPreSelectedUser];
    }

    return userProfilesWithCount.map(
      (up: UserProfileWithCount): UserProfileTypeWithCount => {
        return {userTypeString: up.userTypeString, count: up.count};
      },
    );
  }, [defaultUserTypeString, userProfiles, userProfilesWithCount]);

  const defaultSelectableTravellers = useTravellersWithPreselectedCounts(
    userProfiles,
    defaultPreassignedFareProduct,
    defaultSelection,
  );

  return {
    preassignedFareProduct: defaultPreassignedFareProduct,
    selectableTravellers: defaultSelectableTravellers,
    fromPlace: defaultFromPlace,
    toPlace: defaultToPlace,
  };
}

const getCountIfUserIsIncluded = (
  u: UserProfile,
  selections: UserProfileTypeWithCount[],
): number => {
  const selectedUser = selections.filter(
    (up: UserProfileTypeWithCount) => up.userTypeString === u.userTypeString,
  );

  if (selectedUser.length < 1) return 0;
  return selectedUser[0].count;
};

/**
 * Get the default user profiles with count. If a default user profile has been
 * selected in the preferences that profile will have a count of one. If no
 * default user profile preference exists then the first user profile will have
 * a count of one.
 */
const useTravellersWithPreselectedCounts = (
  userProfiles: UserProfile[],
  preassignedFareProduct: PreassignedFareProduct,
  defaultSelections: UserProfileTypeWithCount[],
) =>
  useMemo(() => {
    const mappedUserProfiles = userProfiles
      .filter((u) =>
        preassignedFareProduct.limitations.userProfileRefs.includes(u.id),
      )
      .map((u) => ({
        ...u,
        count: getCountIfUserIsIncluded(u, defaultSelections),
      }));

    if (
      !mappedUserProfiles.some(({count}) => count) &&
      mappedUserProfiles.length > 0 // how to handle if length 0?
    ) {
      mappedUserProfiles[0].count = 1;
    }
    return mappedUserProfiles;
  }, [userProfiles, preassignedFareProduct, defaultSelections]);
