import {
  PreassignedFareProduct,
  FareZone,
  UserProfile,
  FareProductTypeConfig,
  useFirestoreConfigurationContext,
  findReferenceDataById,
  SupplementProduct,
} from '@atb/modules/configuration';
import {
  RecentOrderDetails,
  useGetFareProductsQuery,
  useGetSupplementProductsQuery,
} from '@atb/modules/ticketing';
import {TravelRightDirection} from '@atb-as/utils';
import {useMemo} from 'react';
import {RecentFareContractType} from '@atb/recent-fare-contracts/types';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {enumFromString} from '@atb/utils/enum-from-string';
import {isDefined} from '@atb/utils/presence';
import {getBaggageProducts} from '@atb/modules/fare-contracts';
import {mapUniqueWithCount} from '@atb/utils/unique-with-count';
import {isProductSellableInApp} from '@atb/utils/is-product-sellable-in-app';
import {useRecentFareContractsQuery} from './use-recent-fare-contracts-query';

const mapUsers = (
  users: {[userProfile: string]: number},
  userProfiles: UserProfile[],
) =>
  Object.entries(users)
    .flatMap(([profileId, count]) => {
      const userProfile = findReferenceDataById(userProfiles, profileId);
      return userProfile ? [{...userProfile, count}] : [];
    })
    .sort(
      // Sort by user profile order in remote config
      (u1, u2) =>
        userProfiles.findIndex((profile) => profile.id === u1.id) -
        userProfiles.findIndex((profile) => profile.id === u2.id),
    );

const mapBackendRecentFareContracts = (
  recentFareContract: RecentOrderDetails,
  preassignedFareProducts: PreassignedFareProduct[],
  supplementFareProducts: SupplementProduct[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  fareZones: FareZone[],
  userProfiles: UserProfile[],
): RecentFareContractType | null => {
  const productsInFareContract = recentFareContract.products
    .map((p) => findReferenceDataById(preassignedFareProducts, p))
    .filter(isDefined);

  /*
   *  We lack some information to properly handle supplement products
   *  as recent fare contracts (no preassignedFareProduct for bike ticket,
   *  and no existingProduct for reservation), so for now we will only
   *  show recent fare contracts that aren't supplement products.
   */
  const sellableProductsInFareContract = productsInFareContract.filter(
    (p) => isProductSellableInApp(p) && !p.isSupplementProduct,
  );

  const preassignedFareProduct = sellableProductsInFareContract[0];

  if (!preassignedFareProduct) {
    return null;
  }

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct.type,
  );

  if (!fareProductTypeConfig) {
    return null;
  }

  const baggageProducts = getBaggageProducts(
    productsInFareContract,
    supplementFareProducts,
  );

  const baggageProductsWithCount = mapUniqueWithCount(
    baggageProducts,
    (a, b) => a.id === b.id,
  );

  const userProfilesWithCount = mapUsers(
    recentFareContract.users,
    userProfiles,
  );

  if (!userProfilesWithCount?.length && !baggageProductsWithCount?.length) {
    return null;
  }

  const fromFareZone = recentFareContract.zones
    ? findReferenceDataById(fareZones, recentFareContract.zones[0])
    : undefined;
  const toFareZone = recentFareContract.zones
    ? findReferenceDataById(fareZones, recentFareContract.zones.slice(-1)[0])
    : undefined;

  const direction: TravelRightDirection | undefined = enumFromString(
    TravelRightDirection,
    recentFareContract.direction,
  );

  const pointToPointValidity = recentFareContract.pointToPointValidity;

  const fromId = pointToPointValidity?.fromPlace || fromFareZone?.id;
  const toId = pointToPointValidity?.toPlace || toFareZone?.id;

  const id =
    preassignedFareProduct?.id +
    fromId +
    toId +
    userProfilesWithCount.map((u) => u.id + u.count).join();

  return {
    id,
    direction,
    preassignedFareProduct,
    fromFareZone,
    toFareZone,
    pointToPointValidity,
    userProfilesWithCount,
    baggageProductsWithCount,
  };
};

/**
 * This method:
 * - Maps from the api RecentFareContract format to the app RecentFareContract
 *   format
 * - Filter out recent fare contracts where the product or fare zones were not
 *   found in our reference data, or none of the user profiles were found in our
 *   reference data
 * - Sort descending by created date
 * - Remove similar fare contracts, which means those which have same product,
 *   same zones and same travellers (same id)
 * - Return only the first three fare contracts, which will be the three most
 *   recent fare contracts
 */
const mapToLastThreeUniqueRecentFareContracts = (
  recentFareContracts: RecentOrderDetails[],
  preassignedFareProducts: PreassignedFareProduct[],
  supplementFareProducts: SupplementProduct[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  fareZones: FareZone[],
  userProfiles: UserProfile[],
): RecentFareContractType[] => {
  return recentFareContracts
    .sort((fc1, fc2) => fc2.createdAt.localeCompare(fc1.createdAt))
    .map((recentFareContract) =>
      mapBackendRecentFareContracts(
        recentFareContract,
        preassignedFareProducts,
        supplementFareProducts,
        fareProductTypeConfigs,
        fareZones,
        userProfiles,
      ),
    )
    .filter(isDefined)
    .filter(onlyUniquesBasedOnField('id'))
    .slice(0, 3);
};

export const useRecentFareContracts = () => {
  const {fareProductTypeConfigs, fareZones, userProfiles} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {data: supplementFareProducts} = useGetSupplementProductsQuery();

  const {
    data: recentFareContractsData,
    isLoading: recentFareContractsLoading,
    refetch: recentFareContractsRefetch,
  } = useRecentFareContractsQuery();

  const recentFareContracts = useMemo(
    () =>
      mapToLastThreeUniqueRecentFareContracts(
        recentFareContractsData ?? [],
        preassignedFareProducts,
        supplementFareProducts,
        fareProductTypeConfigs,
        fareZones,
        userProfiles,
      ),
    [
      recentFareContractsData,
      preassignedFareProducts,
      supplementFareProducts,
      fareProductTypeConfigs,
      fareZones,
      userProfiles,
    ],
  );

  return {
    recentFareContractsLoading,
    recentFareContracts,
    recentFareContractsRefetch,
  };
};
