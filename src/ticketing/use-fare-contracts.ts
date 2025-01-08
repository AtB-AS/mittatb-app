import {useTicketingContext} from '@atb/ticketing/TicketingContext';
import type {AvailabilityStatus, FareContract} from '@atb/ticketing/types';
import {getAvailabilityStatus} from '@atb/ticketing/get-availability-status';
import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {getFareContracts} from '@atb/ticketing/api';
import {useAuthContext} from '@atb/auth';

type AvailabilityStatusInput = {
  availability: Exclude<AvailabilityStatus['availability'], 'invalid'>;
  status?: Exclude<AvailabilityStatus['status'], 'invalid'>;
};

export const useFareContracts = (
  availabilityStatus: AvailabilityStatusInput,
  now: number,
): {fareContracts: FareContract[]; refetch: () => void} => {
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

  const filteredContracts = fareContracts.filter((fc) => {
    const as = getAvailabilityStatus(fc, now);
    if (as.availability === availabilityStatus.availability) {
      return availabilityStatus.status
        ? as.status === availabilityStatus.status
        : true;
    }

    return false;
  });

  return {fareContracts: filteredContracts, refetch};
};

const useGetFareContractsQuery = (
  availability: AvailabilityStatusInput['availability'],
) => {
  const {userId} = useAuthContext();
  return useQuery({
    queryKey: ['FETCH_FARE_CONTRACTS', availability, userId],
    queryFn: () => getFareContracts(mapAvailability(availability)),
    enabled: false,
    retry: 0,
  });
};

const mapAvailability = (
  availability: AvailabilityStatusInput['availability'],
) => {
  switch (availability) {
    case 'available':
      return 'Available';
    case 'historic':
      return 'Historical';
  }
};
