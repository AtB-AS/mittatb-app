import {useTicketingContext} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {getFareContracts} from '@atb/modules/ticketing';
import {useAuthContext} from '@atb/modules/auth';
import {getAvailabilityStatus, AvailabilityStatus} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';
import {ONE_WEEK_MS} from '@atb/utils/durations';
import {getServerNowGlobal} from '../time';
import {useFeatureTogglesContext} from '../feature-toggles';
import {useRemoteConfigContext} from '../remote-config';
import {create} from 'zustand';

type AvailabilityStatusInput = {
  availability: Exclude<AvailabilityStatus['availability'], 'invalid'>;
  status?: Exclude<AvailabilityStatus['status'], 'invalid'>;
};

/**
 * Hook for subscribing to fare contracts with the given availability and
 * status. The fare contracts are retrieved from Firestore, but this hook
 * also exposes a refetch function for retrieving them through an API call. The
 * reason for this is that we have some reports of fare contracts not appearing
 * in the app, and it seems a possible reason is a faulty Firestore
 * subscription.
 */
export const useFareContracts = (
  availabilityStatus: AvailabilityStatusInput,
  now: number,
): {
  fareContracts: FareContractType[];
  refetch: () => void;
  isFetching: boolean;
  isError: boolean;
} => {
  const {fareContracts: fareContractsFromFirestore} = useTicketingContext();
  const {enable_ticketing} = useRemoteConfigContext();
  const {isEventStreamEnabled, isEventStreamFareContractsEnabled} =
    useFeatureTogglesContext();
  const {
    refetch: getFareContractsFromBackend,
    isFetching,
    isError,
    status,
    isFetchedAfterMount,
    dataUpdatedAt,
  } = useGetFareContractsQuery({
    enabled:
      enable_ticketing &&
      isEventStreamEnabled &&
      isEventStreamFareContractsEnabled,
    availability: availabilityStatus.availability,
  });

  const setNeedsRefresh = useNeedsRefreshStore(
    (state) => state.setNeedsRefresh,
  );
  useEffect(() => {
    // Whenever data is updated (`dataUpdatedAt` changes), we should reset the
    // needsRefresh flag if
    // 1. the query was successful
    // 2. the data is fresh and not from cache (`isFetchedAfterMount`)
    if (status === 'success' && isFetchedAfterMount) setNeedsRefresh(false);
  }, [status, isFetchedAfterMount, setNeedsRefresh, dataUpdatedAt]);

  const [fareContracts, setFareContracts] = useState(
    fareContractsFromFirestore,
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    setFareContracts(fareContractsFromFirestore);
  }, [fareContractsFromFirestore]);

  const refetch = () => {
    // On refetch, also invalidate queries with availability !== 'available' to
    // ensure consistency throughout the app.
    invalidateFareContractsQuery(queryClient);
    getFareContractsFromBackend().then(({data, isSuccess}) => {
      if (isSuccess) {
        const parsedFareContracts = data
          ?.map((fc) => FareContractType.safeParse(fc).data)
          .filter(isDefined);
        setFareContracts(parsedFareContracts);
      }
    });
  };

  const filteredFareContracts = getFilterdFareContracts(
    fareContracts,
    availabilityStatus,
    now,
  );

  return {
    fareContracts: filteredFareContracts,
    refetch,
    isFetching,
    isError,
  };
};
const fareContractsQueryKey = 'FETCH_FARE_CONTRACTS';
export const useGetFareContractsQuery = (props: {
  enabled: boolean;
  availability: AvailabilityStatusInput['availability'] | undefined;
}) => {
  const {abtCustomerId} = useAuthContext();
  return useQuery({
    queryKey: [fareContractsQueryKey, abtCustomerId, props.availability],
    queryFn: () => getFareContracts(props.availability),
    enabled: props.enabled && !!abtCustomerId,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: false,
    retry: 0,
    gcTime: ONE_WEEK_MS,
    meta: {
      persistInAsyncStorage: true,
    },
  });
};

export const invalidateFareContractsQuery = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({queryKey: [fareContractsQueryKey]});
  useNeedsRefreshStore.getState().setNeedsRefresh(true);
};

export const getFilterdFareContracts = (
  fareContracts: FareContractType[],
  availabilityStatus: AvailabilityStatusInput,
  now = getServerNowGlobal(),
) =>
  fareContracts.filter((fc) => {
    const as = getAvailabilityStatus(fc, now);
    if (as.availability === availabilityStatus.availability) {
      return availabilityStatus.status
        ? as.status === availabilityStatus.status
        : true;
    }

    return false;
  });

type FareContractsNeedRefreshStore = {
  needsRefresh: boolean;
  setNeedsRefresh: (needsRefresh: boolean) => void;
};
/**
 * Keeps track of whether fare contracts are in a known outdated state. E.g.
 * after a ticket purchase. We use this to show a message to the user in cases
 * where the fare contracts state is empty or outdated, but not when a single
 * fetch failed, since that's likely not a problem.
 */
export const useNeedsRefreshStore = create<FareContractsNeedRefreshStore>(
  (set) => ({
    needsRefresh: true,
    setNeedsRefresh: (needsRefresh) => set({needsRefresh}),
  }),
);
