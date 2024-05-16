import {useQuery} from '@tanstack/react-query';
import Bugsnag from '@bugsnag/react-native';
import {storage} from '@atb/storage';
import {
  ActivatedToken,
  TokenAction,
} from '@entur-private/abt-mobile-client-sdk';
import {mobileTokenClient} from '@atb/mobile-token/mobileTokenClient';
import {tokenService} from '@atb/mobile-token/tokenService';
import {
  TokenEncodingInvalidRemoteTokenStateError,
  TokenMustBeRenewedRemoteTokenStateError,
  TokenMustBeReplacedRemoteTokenStateError,
  TokenNotFoundRemoteTokenStateError,
} from '@entur-private/abt-token-server-javascript-interface';
import {v4 as uuid} from 'uuid';
import {MOBILE_TOKEN_QUERY_KEY} from '@atb/mobile-token/utils';
import {updateMetadata} from '@atb/chat/metadata';

export const LOAD_NATIVE_TOKEN_QUERY_KEY = 'loadNativeToken';
export const useLoadNativeTokenQuery = (
  enabled: boolean,
  userId: string | undefined,
  intercomEnabled: boolean,
) =>
  useQuery({
    queryKey: [MOBILE_TOKEN_QUERY_KEY, LOAD_NATIVE_TOKEN_QUERY_KEY, userId],
    queryFn: async () => {
      const traceId = uuid();
      try {
        const token = await loadNativeToken(userId!, traceId, intercomEnabled);
        logSuccess(token, intercomEnabled);
        return token;
      } catch (err: any) {
        logError(err, traceId, intercomEnabled);
        throw err;
      }
    },
    enabled,
  });

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
const loadNativeToken = async (
  userId: string,
  traceId: string,
  intercomEnabled: boolean,
) => {
  Bugsnag.leaveBreadcrumb(`Loading mobile token state for user ${userId}`);

  /*
    Check if there has been a user change.
     */
  const lastUserId = await storage.get('@ATB_last_mobile_token_user');
  const noUserChange = lastUserId === userId;

  let token: ActivatedToken | undefined;
  if (noUserChange) {
    // Retrieve the token from the native layer
    token = await mobileTokenClient.get(traceId);

    if (token) {
      /*
      If native token exists then validate it. The validation request will
      throw an error if validation fails, and these errors will be handled
      as best possible.
       */
      try {
        Bugsnag.leaveBreadcrumb(`Validating token ${token.getTokenId()}`);
        const signedToken = await mobileTokenClient.encode(token, [
          TokenAction.TOKEN_ACTION_GET_FARECONTRACTS,
        ]);
        await tokenService.validate(token, signedToken, traceId);
      } catch (err) {
        if (
          err instanceof TokenMustBeReplacedRemoteTokenStateError ||
          err instanceof TokenNotFoundRemoteTokenStateError
        ) {
          token = undefined;
        } else if (err instanceof TokenEncodingInvalidRemoteTokenStateError) {
          Bugsnag.leaveBreadcrumb('Wiping token with id ' + token.tokenId);
          await tokenService.removeToken(token.getTokenId(), traceId);
          await mobileTokenClient.clear();
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
    Bugsnag.leaveBreadcrumb(`Creating new mobile token`);
    token = await mobileTokenClient.create(traceId);
  }
  await storage.set('@ATB_last_mobile_token_user', userId!);
  if (intercomEnabled) {
    updateMetadata({
      'AtB-Mobile-Token-Id': token.tokenId,
      'AtB-Mobile-Token-Status': 'success',
      'AtB-Mobile-Token-Error-Correlation-Id': undefined,
    });
  }
  return token;
};

const logSuccess = (token: ActivatedToken, intercomEnabled: boolean) => {
  if (intercomEnabled) {
    updateMetadata({
      'AtB-Mobile-Token-Id': token.tokenId,
      'AtB-Mobile-Token-Status': 'success',
      'AtB-Mobile-Token-Error-Correlation-Id': undefined,
    });
  }
};

const logError = (err: Error, traceId: string, intercomEnabled: boolean) => {
  if (intercomEnabled) {
    updateMetadata({
      'AtB-Mobile-Token-Id': undefined,
      'AtB-Mobile-Token-Status': 'error',
      'AtB-Mobile-Token-Error-Correlation-Id': traceId,
    });
  }
  Bugsnag.notify(err, (event) => {
    event.addMetadata('token', {
      traceId,
      description: 'Error loading mobile token state',
    });
  });
};
