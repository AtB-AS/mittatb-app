import {useAuthState} from '@atb/auth';
import {listRecurringPayments} from '@atb/ticketing';
import {useQuery} from '@tanstack/react-query';

const ONE_HOUR_MS = 1000 * 60 * 60;

export const LIST_RECURRING_PAYMENTS_QUERY_KEY = 'getListRecurringPayments';

export const useListRecurringPaymentsQuery = () => {
  const {authenticationType, abtCustomerId} = useAuthState();

  return useQuery({
    queryKey: [LIST_RECURRING_PAYMENTS_QUERY_KEY, abtCustomerId, authenticationType],
    queryFn: async () => {
      if (authenticationType === 'phone') {
        return await listRecurringPayments();          
      }
      return [];
    },
    cacheTime: ONE_HOUR_MS,
  });
};
