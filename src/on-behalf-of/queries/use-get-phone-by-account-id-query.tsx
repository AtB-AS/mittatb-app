import {getPhoneNumberFromId} from '@atb/api/profile';
import {useQuery} from '@tanstack/react-query';

const ONE_MINUTE = 1000 * 60;

export const useGetPhoneByAccountIdQuery = (accountId: string) =>
  useQuery({
    queryKey: ['getPhoneByAccountId', accountId],
    queryFn: () => getPhoneNumberFromId(accountId),
    enabled: accountId !== undefined && accountId !== '',
    staleTime: ONE_MINUTE,
    cacheTime: ONE_MINUTE,
  });
