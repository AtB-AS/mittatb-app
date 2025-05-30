import {useMutation, useQueryClient} from '@tanstack/react-query';
import {tokenService} from '../tokenService';
import {v4 as uuid} from 'uuid';
import {GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY} from '../use-token-toggle-details';
import {LIST_REMOTE_TOKENS_QUERY_KEY} from './use-list-remote-tokens-query';
import {MOBILE_TOKEN_QUERY_KEY} from '../utils';
import {useAuthContext} from '@atb/modules/auth';
import {useMobileTokenContext} from '../MobileTokenContext';

type Args = {
  tokenId: string;
  bypassRestrictions: boolean;
};
export const useToggleTokenMutation = () => {
  const queryClient = useQueryClient();
  const {userId} = useAuthContext();
  const {nativeToken, secureContainer} = useMobileTokenContext();
  return useMutation({
    mutationFn: ({tokenId, bypassRestrictions}: Args) =>
      tokenService.toggle(tokenId, uuid(), bypassRestrictions),
    onSuccess: (tokens) => {
      queryClient.setQueryData(
        [
          MOBILE_TOKEN_QUERY_KEY,
          LIST_REMOTE_TOKENS_QUERY_KEY,
          userId,
          nativeToken?.tokenId,
          secureContainer,
        ],
        tokens,
      );
      queryClient.invalidateQueries([
        MOBILE_TOKEN_QUERY_KEY,
        GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY,
      ]);
    },
  });
};
