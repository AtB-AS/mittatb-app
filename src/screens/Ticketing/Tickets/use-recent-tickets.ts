import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {
  RemoteConfigContextState,
  useRemoteConfig,
} from '@atb/RemoteConfigContext';
import {listRecentFareContracts, RecentFareContract} from '@atb/tickets';
import {useEffect, useMemo, useReducer} from 'react';
import {UserProfileWithCount} from '../Purchase/Travellers/use-user-count-state';

export type RecentTicket = {
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone: TariffZone;
  toTariffZone: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
};

type State = {
  error: boolean;
  loading: boolean;
  recentFareContracts: RecentFareContract[];
};

const initialState: State = {
  error: false,
  loading: true,
  recentFareContracts: [],
};

type Action =
  | {type: 'FETCH'}
  | {type: 'ERROR'}
  | {type: 'SUCCESS'; data: RecentFareContract[]};

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

const mapRecentFareContractToRecentTicket = (
  recentFareContract: RecentFareContract,
  {
    tariff_zones: tariffZones,
    user_profiles: userProfiles,
    preassigned_fare_products: preassignedFareProducts,
  }: RemoteConfigContextState,
): RecentTicket | null => {
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    recentFareContract.products[0],
  );

  const fromTariffZone = findReferenceDataById(
    tariffZones,
    recentFareContract.zones[0],
  );
  const toTariffZone = findReferenceDataById(
    tariffZones,
    recentFareContract.zones.slice(-1)[0],
  );

  const userProfilesWithCount = mapUsers(
    recentFareContract.users,
    userProfiles,
  );

  if (
    !preassignedFareProduct ||
    !fromTariffZone ||
    !toTariffZone ||
    !userProfilesWithCount?.length
  ) {
    return null;
  }

  return {
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
  };
};

const isUsersEqual = (
  users1: UserProfileWithCount[],
  users2: UserProfileWithCount[],
) => {
  if (users1.length !== users2.length) return false;

  return users1.reduce(
    (isEqual, user1) =>
      isEqual &&
      users2.some(
        (user2) => user1.id === user2.id && user1.count === user2.count,
      ),
    true,
  );
};

const isTicketsEqual = (t1: RecentTicket, t2: RecentTicket) =>
  t1.preassignedFareProduct.id === t2.preassignedFareProduct.id &&
  t1.fromTariffZone.id === t2.fromTariffZone.id &&
  t1.toTariffZone.id === t2.toTariffZone.id &&
  isUsersEqual(t1.userProfilesWithCount, t2.userProfilesWithCount);

const containsTicket = (
  existingTickets: RecentTicket[],
  currentTicket: RecentTicket,
) =>
  existingTickets.some((existing) => isTicketsEqual(existing, currentTicket));

/**
 * This method:
 * - Maps from the api RecentFareContract format to the RecentTicket format
 * - Filter out tickets where the product or tariff zones were not found in our
 *   reference data, or none of the user profiles were found in our reference
 *   data
 * - Sort descending by created date
 * - Remove similar tickets, which means tickets with same product, same zones
 *   and same travellers
 * - Return only the first three tickets, which will be the three most recent
 *   tickets
 */
const mapToLastThreeUniqueTickets = (
  recentFareContracts: RecentFareContract[],
  remoteConfigState: RemoteConfigContextState,
): RecentTicket[] => {
  return recentFareContracts
    .sort((fc1, fc2) => fc2.created_at.localeCompare(fc1.created_at))
    .reduce<RecentTicket[]>((mappedTickets, fc) => {
      const maybeTicket = mapRecentFareContractToRecentTicket(
        fc,
        remoteConfigState,
      );
      return maybeTicket ? mappedTickets.concat(maybeTicket) : mappedTickets;
    }, [])
    .reduce<RecentTicket[]>(
      (uniques, ticket) =>
        containsTicket(uniques, ticket) ? uniques : uniques.concat(ticket),
      [],
    )
    .slice(0, 3);
};

export default function useRecentTickets() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const remoteConfigState = useRemoteConfig();

  const fetchRecentFareContracts = async () => {
    dispatch({type: 'FETCH'});
    try {
      const recentFareContracts = await listRecentFareContracts();
      dispatch({type: 'SUCCESS', data: recentFareContracts});
    } catch (e) {
      dispatch({type: 'ERROR'});
    }
  };

  useEffect(() => {
    fetchRecentFareContracts();
  }, []);

  const recentTickets = useMemo(
    () =>
      mapToLastThreeUniqueTickets(state.recentFareContracts, remoteConfigState),
    [state.recentFareContracts, remoteConfigState],
  );

  return {
    loading: state.loading,
    error: state.error,
    recentTickets,
    refresh: fetchRecentFareContracts,
  };
}
