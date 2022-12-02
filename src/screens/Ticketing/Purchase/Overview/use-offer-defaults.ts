import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useFareProductConfig} from '@atb/configuration/utils';
import {usePreferences} from '@atb/preferences';
import {
  PreassignedFareProduct,
  PreassignedFareProductType,
  PreassignedFareProductWithConfig,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {useMemo} from 'react';
import {TariffZoneWithMetadata} from '../TariffZones';
import {UserProfileWithCount} from '../Travellers/use-user-count-state';
import {useTariffZoneFromLocation} from '../utils';

type UserProfileTypeWithCount = {
  userTypeString: string;
  count: number;
};

export function useOfferDefaults(
  preassignedFareProduct?: PreassignedFareProduct,
  selectableProductType?: PreassignedFareProductType,
  userProfilesWithCount?: UserProfileWithCount[],
  fromTariffZone?: TariffZoneWithMetadata,
  toTariffZone?: TariffZoneWithMetadata,
) {
  const {
    tariffZones,
    userProfiles,
    preassignedFareProducts,
    fareProductTypeConfigs,
  } = useFirestoreConfiguration();

  // Get default PreassignedFareProduct
  const productType = preassignedFareProduct?.type ?? selectableProductType;
  const selectableProducts = preassignedFareProducts
    .filter(productIsSellableInApp)
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

  const preassignedFareProductConfig = useFareProductConfig(
    defaultPreassignedFareProduct.type,
  );

  var preassignedFareProductWithConfigurations: PreassignedFareProductWithConfig =
    {
      ...defaultPreassignedFareProduct,
      config: preassignedFareProductConfig,
    };

  return {
    preassignedFareProduct: preassignedFareProductWithConfigurations,
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
 * Get the default tariff zone, either based on current location or else the
 * first tariff zone in the provided tariff zones list.
 */
const useDefaultTariffZone = (
  tariffZones: TariffZone[],
): TariffZoneWithMetadata => {
  const tariffZoneFromLocation = useTariffZoneFromLocation(tariffZones);
  return useMemo<TariffZoneWithMetadata>(
    () =>
      tariffZoneFromLocation
        ? {...tariffZoneFromLocation, resultType: 'geolocation'}
        : {...tariffZones[0], resultType: 'zone'},
    [tariffZones, tariffZoneFromLocation],
  );
};
