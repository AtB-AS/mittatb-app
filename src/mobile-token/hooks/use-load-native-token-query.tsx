import {useQuery} from '@tanstack/react-query';
import {storage} from '@atb/storage';
import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {mobileTokenClient} from '@atb/mobile-token/mobileTokenClient';
import {tokenService} from '@atb/mobile-token/tokenService';
import {
  TokenEncodingInvalidRemoteTokenStateError,
  TokenMustBeRenewedRemoteTokenStateError,
  TokenMustBeReplacedRemoteTokenStateError,
  TokenNotFoundRemoteTokenStateError,
} from '@entur-private/abt-token-server-javascript-interface';
import {v4 as uuid} from 'uuid';
import {
  getSdkErrorHandlingStrategy,
  getSdkErrorTokenIds,
  MOBILE_TOKEN_QUERY_KEY,
} from '../utils';
import {useIntercomMetadata} from '@atb/chat/use-intercom-metadata';
import {logToBugsnag} from '@atb/utils/bugsnag-utils';
import {wipeToken} from '@atb/mobile-token/helpers';
import Bugsnag from '@bugsnag/react-native';

export const LOAD_NATIVE_TOKEN_QUERY_KEY = 'loadNativeToken';
export const useLoadNativeTokenQuery = (
  enabled: boolean,
  userId: string | undefined,
) => {
  const {updateMetadata} = useIntercomMetadata();

  return useQuery({
    queryKey: [MOBILE_TOKEN_QUERY_KEY, LOAD_NATIVE_TOKEN_QUERY_KEY, userId],
    queryFn: async () => {
      const traceId = uuid();
      try {
        const token = await loadNativeToken(userId!, traceId);
        updateMetadata({
          'AtB-Mobile-Token-Id': token.tokenId,
          'AtB-Mobile-Token-Status': token.isAttested()
            ? 'attested'
            : 'non-attested',
          'AtB-Mobile-Token-Error-Correlation-Id': undefined,
        });
        return token;
      } catch (err: any) {
        updateMetadata({
          'AtB-Mobile-Token-Id': undefined,
          'AtB-Mobile-Token-Status': 'error',
          'AtB-Mobile-Token-Error-Correlation-Id': traceId,
        });
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
 * - If no user change retrieve the token from the client-sdk. If necessary,
 *   the token will be renewed while getting it.
 * - If a token already exists it will be validated, and any exceptions thrown
 *   will be handled accordingly.
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
      const errHandling = getSdkErrorHandlingStrategy(err);
      switch (errHandling) {
        case 'reset':
          logError(err, traceId);
          await wipeToken(getSdkErrorTokenIds(err), traceId);
          break;
        case 'unspecified':
          throw err;
      }
    }

    if (token) {
      /*
      If native token exists then validate it. The validation request will
      throw an error if validation fails, and these errors will be handled
      as best possible.
       */
      try {
        logToBugsnag(`Validating token ${token.getTokenId()}`);
        await tokenService.validate(token, traceId);
      } catch (err) {
        const tokenSdkErrorHandling = getSdkErrorHandlingStrategy(err);
        if (
          err instanceof TokenMustBeReplacedRemoteTokenStateError ||
          err instanceof TokenNotFoundRemoteTokenStateError
        ) {
          token = undefined;
        } else if (
          err instanceof TokenEncodingInvalidRemoteTokenStateError ||
          tokenSdkErrorHandling === 'reset'
        ) {
          wipeToken([token.tokenId], traceId);
          token = undefined;
        } else if (err instanceof TokenMustBeRenewedRemoteTokenStateError) {
          token = await mobileTokenClient.renew(token, traceId);
        } else {
          throw err;
        }
      }
    }
  }

  if (!token) {
    /*
    If token is undefined, then create a new one. We can end up here if:
    - No token previously created on this device.
    - There has been a user change and the existing token has been wiped.
    - There was a validation error which signaled that a new token should
      be created.
     */
    logToBugsnag(`Creating new mobile token`);
    token = await mobileTokenClient.create(traceId);
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
