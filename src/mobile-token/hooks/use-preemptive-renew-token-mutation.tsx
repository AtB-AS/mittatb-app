import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Bugsnag from '@bugsnag/react-native';
import {mobileTokenClient} from '../mobileTokenClient';
import {LIST_REMOTE_TOKENS_QUERY_KEY} from './use-list-remote-tokens-query';
import {LOAD_NATIVE_TOKEN_QUERY_KEY} from './use-load-native-token-query';
import {
  getMobileTokenErrorHandlingStrategy,
  getSdkErrorTokenIds,
  MOBILE_TOKEN_QUERY_KEY,
  wipeToken,
} from '../utils';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

export const usePreemptiveRenewTokenMutation = (userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      traceId,
    }: {
      token?: ActivatedToken;
      traceId: string;
    }): Promise<ActivatedToken | undefined> => {
      if (!token) return undefined;
      Bugsnag.leaveBreadcrumb(
        `Checking if token (id: ${token!.tokenId}, validityEnd: ${
          token.validityEnd
        }) should be renewed`,
      );

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
        queryClient.invalidateQueries([
          MOBILE_TOKEN_QUERY_KEY,
          LIST_REMOTE_TOKENS_QUERY_KEY,
        ]);
        queryClient.setQueryData(
          [MOBILE_TOKEN_QUERY_KEY, LOAD_NATIVE_TOKEN_QUERY_KEY, userId],
          renewedToken,
        );
      }
    },
    onError: async (err: any, {token, traceId}) => {
      notifyBugsnag(err, {
        errorGroupHash: 'GetSignedTokenError',
        metadata: {
          description: `Error renewing token ${token?.tokenId}`,
        },
      });
      const errHandling = getMobileTokenErrorHandlingStrategy(err);
      switch (errHandling) {
        case 'reset':
          await wipeToken(getSdkErrorTokenIds(err), traceId);
          queryClient.resetQueries([MOBILE_TOKEN_QUERY_KEY]);
          break;
        case 'unspecified':
        // Do nothing
      }
    },
  });
};
