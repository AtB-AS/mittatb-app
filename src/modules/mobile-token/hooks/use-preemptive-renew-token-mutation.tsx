import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Bugsnag from '@bugsnag/react-native';
import {mobileTokenClient} from '../mobileTokenClient';
import {LOAD_NATIVE_TOKEN_QUERY_KEY} from './use-load-native-token-query';
import {
  getMobileTokenErrorHandlingStrategy,
  getSdkErrorTokenIds,
  MOBILE_TOKEN_QUERY_KEY,
  wipeToken,
} from '../utils';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

/**
 * Custom React hook for preemptively renewing a mobile token if it is about to expire.
 *
 * - Checks if the provided token should be renewed using `mobileTokenClient.shouldRenew`,
 *   which calls `shouldRenewPreemptively` from the SDK
 * - If renewal is needed, calls `mobileTokenClient.renew` and updates the query cache with the new token.
 * - On success, updates the cached token data for the current user.
 * - On error, reports the error to Bugsnag and applies an error handling strategy:
 *   - If the strategy is 'reset', wipes the affected tokens and resets the query cache.
 *   - If the strategy is 'unspecified', no further action is taken.
 *
 * @param userId The current user's ID (optional).
 * @returns A mutation object for triggering token renewal.
 */
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
