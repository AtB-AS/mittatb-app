import {useQuery} from '@tanstack/react-query';
import {storage} from '@atb/modules/storage';
import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {mobileTokenClient} from '../mobileTokenClient';
import {MOBILE_TOKEN_QUERY_KEY} from '../utils';
import {errorToMetadata, logToBugsnag} from '@atb/utils/bugsnag-utils';
import Bugsnag from '@bugsnag/react-native';

export const LOAD_NATIVE_TOKEN_QUERY_KEY = 'loadNativeToken';
export const useLoadNativeTokenQuery = (
  enabled: boolean,
  userId: string | undefined,
  traceId: string,
) => {
  return useQuery({
    queryKey: [MOBILE_TOKEN_QUERY_KEY, LOAD_NATIVE_TOKEN_QUERY_KEY, userId],
    queryFn: async () => {
      try {
        const token = await loadNativeToken(userId!, traceId);
        return token;
      } catch (err: any) {
        logError(err, traceId);
        throw err;
      }
    },
    enabled,
    retry: 0,
  });
};

/**
 * Load/create native token and handle the situations that can arise.
 *
 * - First check if there has been a user change. If there has, then a new
 *   token should always be created (skip to last step).
 * - If no user change, retrieve the token from the client-sdk. If necessary,
 *   the token will be renewed while getting it.
 * - A new token will be created if necessary.
 *
 * Note: This useEffect is large and complex. I tried simplifying it, but I
 * found that breaking it up into smaller parts made it even more hard to
 * follow what is happening.
 */
const loadNativeToken = async (userId: string, traceId: string) => {
  Bugsnag.leaveBreadcrumb(`Loading mobile token state for user ${userId}`);

  /*
    Check if there has been a user change.
     */
  const lastUserId = await storage.get('@ATB_last_mobile_token_user');
  const noUserChange = lastUserId === userId;

  let token: ActivatedToken | undefined;
  if (noUserChange) {
    // Retrieve the token from the native layer
    try {
      token = await mobileTokenClient.get(traceId);
    } catch (err: any) {
      logToBugsnag(`Get token error ${err}`, errorToMetadata(err));
      logError(err, traceId);
    }
  }

  if (!token) {
    /*
    If token is undefined, then create a new one. We can end up here if:
    - No token previously created on this device.
    - There has been a user change and the existing token has been wiped.
    - There was an error where the token resolution is `RESET` as
      suggested by the SDK.
     */
    logToBugsnag(`Creating new mobile token`);
    try {
      token = await mobileTokenClient.create(traceId);
      logToBugsnag(`Created new token ${token.getTokenId()}`);
    } catch (err: any) {
      logToBugsnag(
        `Got error while creating new mobile token `,
        errorToMetadata(err),
      );
      logError(err, traceId);
      throw err;
    }
  }
  await storage.set('@ATB_last_mobile_token_user', userId!);
  return token;
};

const logError = (err: Error, traceId: string) => {
  Bugsnag.notify(err, (event) => {
    event.addMetadata('token', {
      traceId,
      description: 'Error loading mobile token state',
    });
  });
};
