import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {
  listRecentFareContracts,
  RecentFareContractBackend,
  useTicketingState,
} from '@atb/ticketing';
import {useEffect, useMemo, useReducer} from 'react';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {RecentFareContract} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Ticketing_TicketTabNavStack/TicketTabNav_PurchaseTabScreen/types';
import {FareProductTypeConfig} from '@atb/configuration/types';
import {onlyUniquesBasedOnField} from '@atb/utils/only-uniques';

type State = {
  error: boolean;
  loading: boolean;
  recentFareContracts: RecentFareContractBackend[];
};

const initialState: State = {
  error: false,
  loading: true,
  recentFareContracts: [],
};

type Action =
  | {type: 'FETCH'}
  | {type: 'ERROR'}
  | {type: 'SUCCESS'; data: RecentFareContractBackend[]};

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
  users: {[user_profile: string]: string},
  userProfiles: UserProfile[],
) =>
  Object.entries(users)
    .reduce<UserProfileWithCount[]>((foundUserProfiles, [profileId, count]) => {
      const userProfile = findReferenceDataById(userProfiles, profileId);
      if (userProfile) {
        const userProfileWithCount = {
          ...userProfile,
          count: parseInt(count),
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
  recentFareContract: RecentFareContractBackend,
  preassignedFareProducts: PreassignedFareProduct[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
): RecentFareContract | null => {
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
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

  const id =
    preassignedFareProduct?.id +
    fromTariffZone?.id +
    toTariffZone?.id +
    userProfilesWithCount.map((u) => u.id + u.count).join();

  return {
    id,
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
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
  recentFareContracts: RecentFareContractBackend[],
  preassignedFareProducts: PreassignedFareProduct[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
): RecentFareContract[] => {
  return recentFareContracts
    .sort((fc1, fc2) => fc2.created_at.localeCompare(fc1.created_at))
    .reduce<RecentFareContract[]>((mappedFareContracts, recentFareContract) => {
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
    }, [])
    .filter(onlyUniquesBasedOnField('id'))
    .slice(0, 3);
};

export const useRecentFareContracts = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {fareContracts} = useTicketingState();
  const {
    preassignedFareProducts,
    fareProductTypeConfigs,
    tariffZones,
    userProfiles,
  } = useFirestoreConfiguration();

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
    () => Math.max(0, ...fareContracts.map((fc) => fc.created.seconds)),
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
