import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
  FareProductTypeConfig,
  useFirestoreConfigurationContext,
  findReferenceDataById,
  isProductSellableInApp,
} from '@atb/modules/configuration';
import {
  listRecentFareContracts,
  RecentOrderDetails,
  useTicketingContext,
} from '@atb/ticketing';
import {TravelRightDirection} from '@atb-as/utils';
import {useEffect, useMemo, useReducer} from 'react';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {RecentFareContractType} from '@atb/recent-fare-contracts/types';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';
import {enumFromString} from '@atb/utils/enum-from-string';

type State = {
  error: boolean;
  loading: boolean;
  recentFareContracts: RecentOrderDetails[];
};

const initialState: State = {
  error: false,
  loading: true,
  recentFareContracts: [],
};

type Action =
  | {type: 'FETCH'}
  | {type: 'ERROR'}
  | {type: 'SUCCESS'; data: RecentOrderDetails[]};

type Reducer = (prevState: State, action: Action) => State;

const reducer: Reducer = (prevState, action): State => {
  switch (action.type) {
    case 'FETCH':
      return {
        ...prevState,
        loading: true,
        error: false,
      };
    case 'ERROR':
      return {
        ...prevState,
        loading: false,
        error: true,
      };
    case 'SUCCESS':
      return {
        ...prevState,
        loading: false,
        error: false,
        recentFareContracts: action.data,
      };
  }
};

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
  fareProductTypeConfigs: FareProductTypeConfig[],
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
): RecentFareContractType | null => {
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts.filter((p) => isProductSellableInApp(p)),
    recentFareContract.products[0],
  );

  if (!preassignedFareProduct) {
    return null;
  }

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct.type,
  );

  if (!fareProductTypeConfig) {
    return null;
  }

  const userProfilesWithCount = mapUsers(
    recentFareContract.users,
    userProfiles,
  );

  if (!userProfilesWithCount?.length) {
    return null;
  }

  const fromTariffZone = findReferenceDataById(
    tariffZones,
    recentFareContract.zones[0],
  );
  const toTariffZone = findReferenceDataById(
    tariffZones,
    recentFareContract.zones.slice(-1)[0],
  );

  const direction: TravelRightDirection | undefined = enumFromString(
    TravelRightDirection,
    recentFareContract.direction,
  );

  const pointToPointValidity = recentFareContract.pointToPointValidity;

  const fromId = pointToPointValidity?.fromPlace || fromTariffZone?.id;
  const toId = pointToPointValidity?.toPlace || toTariffZone?.id;

  const id =
    preassignedFareProduct?.id +
    fromId +
    toId +
    userProfilesWithCount.map((u) => u.id + u.count).join();

  return {
    id,
    direction,
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    pointToPointValidity,
    userProfilesWithCount,
  };
};

/**
 * This method:
 * - Maps from the api RecentFareContract format to the app RecentFareContract
 *   format
 * - Filter out recent fare contracts where the product or tariff zones were not
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
  fareProductTypeConfigs: FareProductTypeConfig[],
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
): RecentFareContractType[] => {
  return recentFareContracts
    .sort((fc1, fc2) => fc2.createdAt.localeCompare(fc1.createdAt))
    .reduce<RecentFareContractType[]>(
      (mappedFareContracts, recentFareContract) => {
        const maybeFareContract = mapBackendRecentFareContracts(
          recentFareContract,
          preassignedFareProducts,
          fareProductTypeConfigs,
          tariffZones,
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

export const useRecentFareContracts = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {fareContracts} = useTicketingContext();
  const {
    preassignedFareProducts,
    fareProductTypeConfigs,
    tariffZones,
    userProfiles,
  } = useFirestoreConfigurationContext();

  const fetchRecentFareContracts = async () => {
    dispatch({type: 'FETCH'});
    try {
      const recentFareContracts = await listRecentFareContracts();
      dispatch({type: 'SUCCESS', data: recentFareContracts});
    } catch (e) {
      dispatch({type: 'ERROR'});
    }
  };

  const latestCreatedTime = useMemo(
    () => Math.max(0, ...fareContracts.map((fc) => fc.created.getSeconds())),
    [fareContracts],
  );

  useEffect(() => {
    fetchRecentFareContracts();
  }, [latestCreatedTime]);

  const recentFareContracts = useMemo(
    () =>
      mapToLastThreeUniqueRecentFareContracts(
        state.recentFareContracts,
        preassignedFareProducts,
        fareProductTypeConfigs,
        tariffZones,
        userProfiles,
      ),
    [
      state.recentFareContracts,
      preassignedFareProducts,
      fareProductTypeConfigs,
      tariffZones,
      userProfiles,
    ],
  );

  return {
    loading: state.loading,
    error: state.error,
    recentFareContracts,
    refresh: fetchRecentFareContracts,
  };
};
