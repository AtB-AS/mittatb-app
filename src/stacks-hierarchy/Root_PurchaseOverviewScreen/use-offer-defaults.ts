import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {usePreferences} from '@atb/preferences';
import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import {isProductSellableInApp} from '@atb/reference-data/utils';
import {useMemo} from 'react';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {
  TariffZoneWithMetadata,
  useTariffZoneFromLocation,
} from '@atb/tariff-zones-selector';
import {useTicketingState} from '@atb/ticketing';

type UserProfileTypeWithCount = {
  userTypeString: string;
  count: number;
};

export function useOfferDefaults(
  preassignedFareProduct?: PreassignedFareProduct,
  selectableProductType?: string,
  userProfilesWithCount?: UserProfileWithCount[],
  fromTariffZone?: TariffZoneWithMetadata,
  toTariffZone?: TariffZoneWithMetadata,
) {
  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();
  const {customerProfile} = useTicketingState();

  // Get default PreassignedFareProduct
  const productType = preassignedFareProduct?.type ?? selectableProductType;
  const selectableProducts = preassignedFareProducts
    .filter((product) => isProductSellableInApp(product, customerProfile))
    .filter((product) => product.type === productType);
  const defaultPreassignedFareProduct =
    preassignedFareProduct ?? selectableProducts[0];

  // Get default TariffZones
  const defaultTariffZone = useDefaultTariffZone(tariffZones);
  const defaultFromTariffZone = fromTariffZone ?? defaultTariffZone;
  const defaultToTariffZone = toTariffZone ?? defaultTariffZone;

  // Get default SelectableTravellers
  const {
    preferences: {defaultUserTypeString},
  } = usePreferences();
  const defaultPreSelectedUser: UserProfileTypeWithCount = {
    userTypeString: defaultUserTypeString ?? userProfiles[0].userTypeString,
    count: 1,
  };
  const preSelectedUsers = userProfilesWithCount?.map(
    (up: UserProfileWithCount): UserProfileTypeWithCount => {
      return {userTypeString: up.userTypeString, count: up.count};
    },
  );
  const defaultSelectableTravellers = useTravellersWithPreselectedCounts(
    userProfiles,
    defaultPreassignedFareProduct,
    preSelectedUsers ?? [defaultPreSelectedUser],
  );

  return {
    preassignedFareProduct: defaultPreassignedFareProduct,
    selectableTravellers: defaultSelectableTravellers,
    fromTariffZone: defaultFromTariffZone,
    toTariffZone: defaultToTariffZone,
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
) => {
  return useMemo(
    () =>
      userProfiles
        .filter((u) =>
          preassignedFareProduct.limitations.userProfileRefs.includes(u.id),
        )
        .map((u) => ({
          ...u,
          count: getCountIfUserIsIncluded(u, defaultSelections),
        })),
    [userProfiles, preassignedFareProduct],
  );
};

/**
 * Get the default tariff zone, either based on current location, default tariff
 * zone set on tariff zone in reference data or else the first tariff zone in the
 * provided tariff zones list.
 */
const useDefaultTariffZone = (
  tariffZones: TariffZone[],
): TariffZoneWithMetadata => {
  const tariffZoneFromLocation = useTariffZoneFromLocation(tariffZones);
  return useMemo<TariffZoneWithMetadata>(() => {
    if (tariffZoneFromLocation) {
      return {...tariffZoneFromLocation, resultType: 'geolocation'};
    }

    const defaultTariffZone = tariffZones.find(
      (tariffZone) => tariffZone.isDefault,
    );

    if (defaultTariffZone) {
      return {...defaultTariffZone, resultType: 'zone'};
    }

    return {...tariffZones[0], resultType: 'zone'};
  }, [tariffZones, tariffZoneFromLocation]);
};
