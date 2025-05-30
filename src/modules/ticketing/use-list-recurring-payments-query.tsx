import {useAuthContext} from '@atb/modules/auth';
import {listRecurringPayments} from '@atb/modules/ticketing';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const LIST_RECURRING_PAYMENTS_QUERY_KEY = 'getListRecurringPayments';

export const useListRecurringPaymentsQuery = () => {
  const {authenticationType, abtCustomerId} = useAuthContext();

  return useQuery({
    queryKey: [
      LIST_RECURRING_PAYMENTS_QUERY_KEY,
      abtCustomerId,
      authenticationType,
    ],
    queryFn: async () => {
      if (authenticationType === 'phone' && abtCustomerId) {
        return await listRecurringPayments();
      }
      return [];
    },
    cacheTime: ONE_HOUR_MS,
  });
};
