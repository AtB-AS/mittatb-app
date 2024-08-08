import {useAuthState} from '@atb/auth';
import {useQuery} from '@tanstack/react-query';
import {fetchOnBehalfOfAccounts} from '@atb/api/profile.ts';
import {ExistingRecipientType} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/types.ts';
import {HALF_DAY_MS} from '@atb/utils/durations.ts';

export const FETCH_RECIPIENTS_QUERY_KEY = 'FETCH_RECIPIENTS';

export const useFetchRecipientsQuery = () => {
  const {userId} = useAuthState();

  return useQuery({
    queryKey: [FETCH_RECIPIENTS_QUERY_KEY, userId],
    queryFn: fetchOnBehalfOfAccounts,
    retry: 0,
    staleTime: HALF_DAY_MS,
    cacheTime: HALF_DAY_MS,
    select: (data) =>
      data.map(
        (r): ExistingRecipientType => ({
          accountId: r.sentToAccountId,
          name: r.sentToAlias,
          phoneNumber: r.sentToPhoneNumber,
        }),
      ),
  });
};
