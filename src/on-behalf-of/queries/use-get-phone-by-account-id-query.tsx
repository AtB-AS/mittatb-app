import {getPhoneNumberFromId} from '@atb/api/profile';
import {useQuery} from '@tanstack/react-query';

const ONE_HOUR = 1000 * 60 * 60;

export const useGetPhoneByAccountIdQuery = (accountId?: string) =>
  useQuery({
    queryKey: ['getPhoneByAccountId', accountId],
    queryFn: () => getPhoneNumberFromId(accountId),
    enabled: !!accountId,
    staleTime: ONE_HOUR,
    cacheTime: ONE_HOUR,
  });
