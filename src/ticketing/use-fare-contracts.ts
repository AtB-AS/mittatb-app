import {useTicketingContext} from '@atb/ticketing/TicketingContext';
import type {FareContractType} from '@atb-as/utils';
import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {getFareContracts} from '@atb/ticketing/api';
import {useAuthContext} from '@atb/modules/auth';
import {getAvailabilityStatus, AvailabilityStatus} from '@atb-as/utils';

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
): {fareContracts: FareContractType[]; refetch: () => void} => {
  const {fareContracts: fareContractsFromFirestore} = useTicketingContext();
  const {refetch: getFareContractsFromBackend} = useGetFareContractsQuery(
    availabilityStatus.availability,
  );

  const [fareContracts, setFareContracts] = useState(
    fareContractsFromFirestore,
  );

  useEffect(() => {
    setFareContracts(fareContractsFromFirestore);
  }, [fareContractsFromFirestore]);

  const refetch = () => {
    getFareContractsFromBackend().then(({data, isSuccess}) => {
      if (isSuccess) setFareContracts(data);
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

  return {fareContracts: filteredFareContracts, refetch};
};

const useGetFareContractsQuery = (
  availability: AvailabilityStatusInput['availability'],
) => {
  const {userId} = useAuthContext();
  return useQuery({
    queryKey: ['FETCH_FARE_CONTRACTS', availability, userId],
    queryFn: () => getFareContracts(availability),
    enabled: false,
    retry: 0,
  });
};
