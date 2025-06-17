import {RemoteToken} from './types';
import {
  ClientNetworkError,
  mapTokenErrorResolution,
  TokenAction,
  TokenEncodingInvalidError,
  TokenErrorResolution,
  TokenFactoryError,
  TokenHasBeenRenewedError,
  TokenMustBeReplacedError,
  TokenNotFoundError,
} from '@entur-private/abt-mobile-client-sdk';
import {isDefined} from '@atb/utils/presence';
import {
  RemoteTokenStateError,
  TokenDeviceAttestationVerificationFailedRemoteTokenError,
  TokenEncodingClockSkewRemoteTokenStateError,
  TokenMustBeRenewedRemoteTokenStateError,
  TokenReattestationRemoteTokenStateError,
} from '@entur-private/abt-token-server-javascript-interface';
import Bugsnag from '@bugsnag/react-native';
import {ErrorResponse, getAxiosErrorType} from '@atb/api/utils';
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
      err instanceof TokenReattestationRemoteTokenStateError
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

type TokenClockSkewErrorDetails = {
  timestamp: number;
  duration: number;
};

const parseErrorKind = (errorResponse: ErrorResponse) => {
  const message = errorResponse.message ?? '';
  switch (errorResponse.kind) {
    case 'TOKEN_NOT_FOUND':
      return new TokenNotFoundError(
        message,
        TokenErrorResolution.RESET,
        undefined,
        undefined,
      );
    case 'TOKEN_MUST_BE_REPLACED':
      return new TokenMustBeReplacedError(
        message,
        TokenErrorResolution.RESET,
        undefined,
        undefined,
      );
    case 'TOKEN_DEVICE_ATTESTATION_VERIFICATION_FAILED':
      return new TokenDeviceAttestationVerificationFailedRemoteTokenError(
        message,
        '',
      );
    case 'TOKEN_HAS_BEEN_RENEWED':
      return new TokenHasBeenRenewedError(
        message,
        TokenErrorResolution.RESET,
        undefined,
        undefined,
      );
    case 'TOKEN_ENCODING_CLOCK_SKEW':
      const details = errorResponse.details?.[0];
      if (details && typeof details === 'object' && 'timestamp' in details) {
        const tokenClockSkewErrorDetails =
          details as TokenClockSkewErrorDetails;
        const timestamp = tokenClockSkewErrorDetails.timestamp;
        const duration = tokenClockSkewErrorDetails.duration;
        return new TokenEncodingClockSkewRemoteTokenStateError(
          timestamp,
          duration,
        );
      } else {
        return new TokenFactoryError(
          'Received TokenClockSkewError but missing details from server',
          TokenErrorResolution.UNKNOWN,
          undefined,
          undefined,
        );
      }
    case 'TOKEN_ENCODING_INVALID':
      return new TokenEncodingInvalidError(
        message,
        TokenErrorResolution.RESET,
        undefined,
        undefined,
      );
    case 'TOKEN_MUST_BE_RENEWED':
      return new TokenMustBeRenewedRemoteTokenStateError(message);
    default:
      return new TokenFactoryError(
        message,
        TokenErrorResolution.UNKNOWN,
        undefined,
        undefined,
      );
  }
};

export const parseTokenServerErrors = (rawError: any) => {
  if (getAxiosErrorType(rawError) === 'network-error') {
    return new ClientNetworkError(rawError.message);
  }

  const errorResponse = ErrorResponse.safeParse(rawError);

  let errorKind: TokenFactoryError | RemoteTokenStateError | undefined;

  if (errorResponse.data?.kind) {
    errorKind = parseErrorKind(errorResponse.data);

    if (errorKind instanceof TokenFactoryError) {
      Bugsnag.leaveBreadcrumb(
        `Received Token Factory Error when calling server: ${errorKind.name}, ${
          errorKind.message
        }, should be resolved using ${
          TokenErrorResolution[errorKind.resolution]
        }`,
      );
    }

    return errorKind;
  }
};

export const isRemoteTokenStateError = (err: any) => {
  const {success, data} = ErrorResponse.safeParse(err.response?.data);
  if (!success) return false;
  const kind = parseErrorKind(data);
  return (
    kind instanceof TokenEncodingClockSkewRemoteTokenStateError ||
    kind instanceof TokenMustBeRenewedRemoteTokenStateError ||
    kind instanceof TokenMustBeReplacedError ||
    kind instanceof TokenHasBeenRenewedError ||
    kind instanceof TokenNotFoundError
  );
};
