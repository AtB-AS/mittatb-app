import {useAuthContext} from '@atb/modules/auth';
import {useQuery} from '@tanstack/react-query';
import {fetchOnBehalfOfAccounts} from '@atb/api/profile';
import {HALF_DAY_MS} from '@atb/utils/durations';
import {OnBehalfOfAccountType} from '@atb/modules/on-behalf-of';

export const FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY =
  'FETCH_ON_BEHALF_OF_ACCOUNTS';

type Params = {enabled: boolean};

export const useFetchOnBehalfOfAccountsQuery = ({enabled}: Params) => {
  const {userId} = useAuthContext();

  return useQuery({
    queryKey: [FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY, userId],
    queryFn: fetchOnBehalfOfAccounts,
    retry: 0,
    staleTime: HALF_DAY_MS,
    gcTime: HALF_DAY_MS,
    enabled,
    select: (data) =>
      data.map(
        (r): OnBehalfOfAccountType => ({
          accountId: r.sentToAccountId,
          name: r.sentToAlias,
          phoneNumber: r.sentToPhoneNumber,
        }),
      ),
  });
};
