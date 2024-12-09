import {RemoteToken} from './types';
import {
  ClientNetworkError,
  TokenAction,
  TokenErrorResolution,
  TokenFactoryError,
} from '@entur-private/abt-mobile-client-sdk';
import {isDefined} from '@atb/utils/presence';
import {parseRemoteError} from '@entur-private/abt-token-server-javascript-interface';

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

/**
 * Get the error handling strategy from a sdk error. As of now we only differ
 * between 'reset' and 'fail', but more handling strategies may be added later.
 *
 * Handling strategies which may be returned:
 * 'reset' - Wipe tokens locally and remotely and start over
 * 'unspecified' - No explicit handling strategy given. May often result in an
 * error message and retry possibility for the user.
 */
export const getSdkErrorHandlingStrategy = (
  err: any,
): 'reset' | 'unspecified' => {
  if (err instanceof TokenFactoryError) {
    switch (err.resolution) {
      case TokenErrorResolution.RESET:
        return 'reset';
      case TokenErrorResolution.GIVE_UP:
      case TokenErrorResolution.RETRY_NOW:
      case TokenErrorResolution.UNKNOWN:
      case TokenErrorResolution.ASK_USER:
      case TokenErrorResolution.IGNORE:
      case TokenErrorResolution.RETRY_LATER:
      case TokenErrorResolution.NONE:
        return 'unspecified';
    }
  }
  return 'unspecified';
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
  if (
    error instanceof TypeError &&
    error.message === 'Network request failed'
  ) {
    return new ClientNetworkError(error.message);
  }

  return parseRemoteError(error) ?? error;
};
