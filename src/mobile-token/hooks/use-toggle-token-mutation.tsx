import {useMutation, useQueryClient} from '@tanstack/react-query';
import {tokenService} from '../tokenService';
import {v4 as uuid} from 'uuid';
import {GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY} from '../use-token-toggle-details';
import {LIST_REMOTE_TOKENS_QUERY_KEY} from './useListRemoteTokensQuery';

type Args = {
  tokenId: string;
  bypassRestrictions: boolean;
};
export const useToggleTokenMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({tokenId, bypassRestrictions}: Args) =>
      tokenService.toggle(tokenId, uuid(), bypassRestrictions),
    onSuccess: (tokens) => {
      queryClient.setQueryData([LIST_REMOTE_TOKENS_QUERY_KEY], tokens);
      queryClient.invalidateQueries([GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY]);
    },
  });
};
