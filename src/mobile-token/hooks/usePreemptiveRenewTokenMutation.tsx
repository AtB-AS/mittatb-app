import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Bugsnag from '@bugsnag/react-native';
import {v4 as uuid} from 'uuid';
import {mobileTokenClient} from '@atb/mobile-token/mobileTokenClient';
import {LIST_REMOTE_TOKENS_QUERY_KEY} from '@atb/mobile-token/hooks/useListRemoteTokensQuery';
import {Dispatch} from 'react';
import {TokenReducerAction} from '@atb/mobile-token/tokenReducer';

export const usePreemptiveRenewTokenMutation = (
  dispatch: Dispatch<TokenReducerAction>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      token?: ActivatedToken,
    ): Promise<ActivatedToken | undefined> => {
      if (!token) return undefined;
      Bugsnag.leaveBreadcrumb(
        `Checking if token (id: ${token!.tokenId}, validityEnd: ${
          token!.validityEnd
        }) should be renewed`,
      );
      const traceId = uuid();
      const shouldRenew = await mobileTokenClient.shouldRenew(token);
      if (shouldRenew) {
        Bugsnag.leaveBreadcrumb(`Renewing token (id: ${token.tokenId})`);
        const renewedToken = await mobileTokenClient.renew(token, traceId);
        Bugsnag.leaveBreadcrumb(
          `Token (new id: ${renewedToken.tokenId}) renewed successfully`,
        );
        return renewedToken;
      }
      return undefined;
    },
    onSuccess: (renewedToken) => {
      if (renewedToken) {
        queryClient.invalidateQueries([LIST_REMOTE_TOKENS_QUERY_KEY]);
        dispatch({type: 'SUCCESS', nativeToken: renewedToken});
      }
    },
  });
};
