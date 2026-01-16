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
  listRecentFareContracts,
  RecentOrderDetails,
  useGetFareProductsQuery,
  useGetSupplementProductsQuery,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {TravelRightDirection} from '@atb-as/utils';
import {useMemo} from 'react';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {RecentFareContractType} from '@atb/recent-fare-contracts/types';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {enumFromString} from '@atb/utils/enum-from-string';
import {isDefined} from '@atb/utils/presence';
import {getBaggageProducts} from '@atb/modules/fare-contracts';
import {mapUniqueWithCount} from '@atb/utils/unique-with-count';
import {useQuery} from '@tanstack/react-query';

const mapUsers = (
  users: {[userProfile: string]: number},
  userProfiles: UserProfile[],
) =>
  Object.entries(users)
    .reduce<UserProfileWithCount[]>((foundUserProfiles, [profileId, count]) => {
      const userProfile = findReferenceDataById(userProfiles, profileId);
      if (userProfile) {
        const userProfileWithCount = {
          ...userProfile,
          count,
        };
        return foundUserProfiles.concat(userProfileWithCount);
      } else {
        return foundUserProfiles;
      }
    }, [])
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

  const sellableProductsInFareContract = productsInFareContract.filter((p) =>
    isProductSellableInApp(p),
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
    fromFareZone: fromFareZone,
    toFareZone: toFareZone,
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
    .reduce<RecentFareContractType[]>(
      (mappedFareContracts, recentFareContract) => {
        const maybeFareContract = mapBackendRecentFareContracts(
          recentFareContract,
          preassignedFareProducts,
          supplementFareProducts,
          fareProductTypeConfigs,
          fareZones,
          userProfiles,
        );
        return maybeFareContract
          ? mappedFareContracts.concat(maybeFareContract)
          : mappedFareContracts;
      },
      [],
    )
    .filter(onlyUniquesBasedOnField('id'))
    .slice(0, 3);
};

export const useRecentFareContractsQuery = () => {
  const {fareContracts} = useTicketingContext();
  const {fareProductTypeConfigs, fareZones, userProfiles} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {data: supplementFareProducts} = useGetSupplementProductsQuery();

  // Trigger refetch when a new fare contract is created
  const latestCreatedTime = useMemo(
    () => Math.max(0, ...fareContracts.map((fc) => fc.created.getSeconds())),
    [fareContracts],
  );

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['recentFareContracts', latestCreatedTime],
    queryFn: listRecentFareContracts,
  });

  const recentFareContracts = useMemo(
    () =>
      mapToLastThreeUniqueRecentFareContracts(
        data ?? [],
        preassignedFareProducts,
        supplementFareProducts,
        fareProductTypeConfigs,
        fareZones,
        userProfiles,
      ),
    [
      data,
      preassignedFareProducts,
      supplementFareProducts,
      fareProductTypeConfigs,
      fareZones,
      userProfiles,
    ],
  );

  return {
    isLoading,
    isError,
    recentFareContracts,
    refresh: refetch,
  };
};
