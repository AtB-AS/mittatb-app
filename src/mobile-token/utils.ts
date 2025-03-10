import {RemoteToken} from './types';
import {
  ClientNetworkError,
  mapTokenErrorResolution,
  TokenAction,
  TokenEncodingInvalidError,
  TokenErrorResolution,
  TokenFactoryError,
} from '@entur-private/abt-mobile-client-sdk';
import {isDefined} from '@atb/utils/presence';
import {
  parseRemoteError,
  RemoteTokenStateError,
  TokenMustBeRenewedRemoteTokenStateError,
  TokenReattestationRemoteTokenStateError,
  TokenReattestationRequiredError,
} from '@entur-private/abt-token-server-javascript-interface';
import Bugsnag from '@bugsnag/react-native';
import {getAxiosErrorType} from '@atb/api/utils';
import {tokenService} from './tokenService';
import {mobileTokenClient} from './mobileTokenClient';
import {
  errorToMetadata,
  logToBugsnag,
  notifyBugsnag,
} from '@atb/utils/bugsnag-utils';

export const MOBILE_TOKEN_QUERY_KEY = 'mobileToken';

export const isInspectable = (remoteToken: RemoteToken) =>
  remoteToken.allowedActions.includes(
    TokenAction[TokenAction.TOKEN_ACTION_TICKET_INSPECTION],
  );

export const isTravelCardToken = (remoteToken?: RemoteToken) =>
  remoteToken?.type === 'ENT:TypeOfTravelDocument:DesfireTravelCard';

export const isMobileToken = (remoteToken?: RemoteToken) =>
  remoteToken?.type === 'ENT:TypeOfTravelDocument:MobileApplication';

export const hasNoTokenType = (remoteToken?: RemoteToken) =>
  isTravelCardToken(remoteToken) && isMobileToken(remoteToken);

export const getTravelCardId = (remoteToken?: RemoteToken) =>
  remoteToken?.keyValues?.find((kv) => kv.key === 'travelCardId')?.value;

export const wipeToken = async (tokensIds: string[], traceId: string) => {
  for (const id of tokensIds) {
    logToBugsnag('Wiping token with id ' + id);
    try {
      await tokenService.removeToken(id, traceId);
    } catch (err: any) {
      logToBugsnag(
        `Other error found during wipe token, ${err}`,
        errorToMetadata(err),
      );
      // if it is not entity deleted error, throw it so it notifies bugsnag
      throw err;
    }
  }
  await mobileTokenClient.clear();
};

/**
 * Get the error handling strategy from an error. Some of these errors has
 * a recommended error resolution from the SDK, if they have a resolution,
 * use the SDK resolution. Otherwise we need to handle it ourselves.
 *
 * As of now we only differ between 'reset' and 'fail',
 * but more handling strategies may be added later.
 *
 * Handling strategies which may be returned:
 * 'reset' - Wipe tokens locally and remotely and start over
 * 'unspecified' - No explicit handling strategy given. May often result in an
 * error message and retry possibility for the user.
 */
export const getMobileTokenErrorHandlingStrategy = (
  err: any,
): 'reset' | 'unspecified' => {
  let errorResolution: TokenErrorResolution | undefined;

  // try to find the error resolution
  if (err instanceof TokenFactoryError) {
    if (err instanceof TokenEncodingInvalidError) {
      return 'reset';
    }
    errorResolution = err.resolution;
  } else if (err instanceof RemoteTokenStateError) {
    if (
      err instanceof TokenMustBeRenewedRemoteTokenStateError ||
      err instanceof TokenReattestationRemoteTokenStateError ||
      err instanceof TokenReattestationRequiredError
    ) {
      // only require renewal or reattestation, do nothing
      return 'unspecified';
    }
    errorResolution = mapTokenErrorResolution(err);
  } else {
    return 'unspecified';
  }

  logToBugsnag(
    `mobile token handle error ${err} with resolution ${errorResolution}`,
    errorToMetadata(err),
  );

  notifyBugsnag(err, {
    errorGroupHash: 'token',
    metadata: {
      description: `Handling error ${err} with resolution of ${errorResolution}`,
    },
  });
  // handle the error resolution
  switch (errorResolution) {
    case TokenErrorResolution.RESET:
      return 'reset';
    case TokenErrorResolution.RETRY_NOW:
    case TokenErrorResolution.RETRY_LATER:
    case TokenErrorResolution.GIVE_UP:
    case TokenErrorResolution.ASK_USER:
    case TokenErrorResolution.IGNORE:
    case TokenErrorResolution.UNKNOWN:
    case TokenErrorResolution.NONE:
      return 'unspecified';
  }
};

/**
 * Get the token ids that are encapsulated in some sdk errors.
 */
export const getSdkErrorTokenIds = (err: any): string[] =>
  err instanceof TokenFactoryError
    ? [err.pendingTokenId?.tokenId, err.activatedTokenId?.tokenId].filter(
        isDefined,
      )
    : [];

/**
 * from https://github.com/entur/abt-mobile-client-sdk/pull/368
 */
export const parseBffCallErrors = (error: any) => {
  if (getAxiosErrorType(error) === 'network-error') {
    return new ClientNetworkError(error.message);
  }

  if (error instanceof TokenFactoryError) {
    Bugsnag.leaveBreadcrumb(
      `Received Token Factory Error when calling BFF: ${error.name}, ${
        error.message
      }, should be resolved using ${TokenErrorResolution[error.resolution]}`,
    );
  }

  return parseRemoteError(error) ?? error;
};

export const isRemoteTokenStateError = (err: any) =>
  parseBffCallErrors(err.response?.data) instanceof RemoteTokenStateError;
