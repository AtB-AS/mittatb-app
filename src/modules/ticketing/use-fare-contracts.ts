import {useTicketingContext} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {getFareContracts} from '@atb/modules/ticketing';
import {useAuthContext} from '@atb/modules/auth';
import {getAvailabilityStatus, AvailabilityStatus} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';

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
  isRefetching: boolean;
} => {
  const {fareContracts: fareContractsFromFirestore} = useTicketingContext();
  const {refetch: getFareContractsFromBackend, isRefetching} =
    useGetFareContractsQuery({
      enabled: false,
      availability: availabilityStatus.availability,
    });

  const [fareContracts, setFareContracts] = useState(
    fareContractsFromFirestore,
  );

  useEffect(() => {
    setFareContracts(fareContractsFromFirestore);
  }, [fareContractsFromFirestore]);

  const refetch = () => {
    getFareContractsFromBackend().then(({data, isSuccess}) => {
      if (isSuccess) {
        const parsedFareContracts = data
          ?.map((fc) => FareContractType.safeParse(fc).data)
          .filter(isDefined);
        setFareContracts(parsedFareContracts);
      }
    });
  };

  const filteredFareContracts = fareContracts.filter((fc) => {
    const as = getAvailabilityStatus(fc, now);
    if (as.availability === availabilityStatus.availability) {
      return availabilityStatus.status
        ? as.status === availabilityStatus.status
        : true;
    }

    return false;
  });

  return {fareContracts: filteredFareContracts, refetch, isRefetching};
};
export const fareContractsQueryKey = 'FETCH_FARE_CONTRACTS';
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
    meta: {
      persistInAsyncStorage: true,
    },
  });
};
