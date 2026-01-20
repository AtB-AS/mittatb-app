import {
  listRecentFareContracts,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';

export const useRecentFareContractsQuery = () => {
  const {fareContracts} = useTicketingContext();

  const latestCreatedTime = useMemo(
    () => Math.max(0, ...fareContracts.map((fc) => fc.created.getSeconds())),
    [fareContracts],
  );

  return useQuery({
    queryKey: ['RECENT_FARE_CONTRACTS', latestCreatedTime],
    queryFn: listRecentFareContracts,
  });
};
