import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteOnBehalfOfAccount} from '@atb/api/profile';
import {useAuthContext} from '@atb/auth';
import {OnBehalfOfAccountsResponse} from '@atb/api/types/profile';
import {useState} from 'react';
import {FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';

export const useDeleteRecipientMutation = () => {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();
  const {active, addActive, removeActive} = useActiveDeletions();

  const mutation = useMutation({
    mutationFn: deleteOnBehalfOfAccount,
    onMutate: (accountId) => addActive(accountId),
    onSuccess: (_, accountId) => {
      removeActive(accountId);
      queryClient.setQueryData(
        [FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY, userId],
        (oldData?: OnBehalfOfAccountsResponse) =>
          oldData?.filter((r) => r.sentToAccountId !== accountId),
      );
    },
    onError: (_, accountId) => removeActive(accountId),
  });
  return {activeDeletions: active, mutation};
};

const useActiveDeletions = () => {
  const [active, setActive] = useState<string[]>([]);
  const addActive = (accountId: string) =>
    setActive((prev) => [...prev, accountId]);
  const removeActive = (accountId: string) =>
    setActive((prev) => prev.filter((accId) => accId !== accountId));
  return {active, addActive, removeActive};
};
