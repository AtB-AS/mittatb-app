import {useAuthState} from '@atb/auth';
import {listRecurringPayments} from '@atb/ticketing';
import {useQuery} from '@tanstack/react-query';

const ONE_HOUR_MS = 1000 * 60 * 60;

export const LIST_RECURRING_PAYMENTS_QUERY_KEY = 'getListRecurringPayments';

export const useListRecurringPaymentsQuery = () => {
  const {authenticationType} = useAuthState();

  return useQuery({
    queryKey: [LIST_RECURRING_PAYMENTS_QUERY_KEY],
    queryFn: listRecurringPayments,
    cacheTime: ONE_HOUR_MS,
    enabled: authenticationType === 'phone',
  });
};
