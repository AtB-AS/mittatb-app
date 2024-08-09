import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteOnBehalfOfAccount} from '@atb/api/profile.ts';
import {useAuthState} from '@atb/auth';
import {FETCH_RECIPIENTS_QUERY_KEY} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-fetch-recipients-query.ts';
import {OnBehalfOfAccountsResponse} from '@atb/api/types/profile.ts';
import {useState} from 'react';

export const useDeleteRecipientMutation = () => {
  const {userId} = useAuthState();
  const queryClient = useQueryClient();
  const {active, addActive, removeActive} = useActiveDeletions();

  const mutation = useMutation({
    mutationFn: deleteOnBehalfOfAccount,
    onMutate: (accountId) => addActive(accountId),
    onSuccess: (_, accountId) => {
      removeActive(accountId);
      queryClient.setQueryData(
        [FETCH_RECIPIENTS_QUERY_KEY, userId],
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
