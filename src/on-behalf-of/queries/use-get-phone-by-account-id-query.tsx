import {getPhoneNumberFromId} from '@atb/api/profile';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const useGetPhoneByAccountIdQuery = (accountId?: string) =>
  useQuery({
    queryKey: ['getPhoneByAccountId', accountId],
    queryFn: () => getPhoneNumberFromId(accountId),
    enabled: !!accountId,
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
