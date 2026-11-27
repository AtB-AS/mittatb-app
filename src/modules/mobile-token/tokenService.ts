import {
  ActivateNewMobileTokenType,
  ClientNetworkError,
  CompleteMobileTokenRenewalType,
  GetMobileTokenDetailsType,
  InitiateMobileTokenRenewalType,
  InitiateNewMobileTokenType,
  isEmulator,
  ReattestMobileTokenType,
} from '@entur-private/react-native-abt';
import {parseRemoteError} from '@entur-private/abt-token-server-javascript-interface';

import {client} from '@atb/api/client';
import {
  ActivateTokenRequest,
  ActiveTokenResponse,
  InitiateTokenResponse,
  InitRequest,
  ListResponse,
  RemoteToken,
  RemoveTokenResponse,
  RenewTokenResponse,
  ToggleResponse,
  TokenLimitResponse,
} from './types';
import {getDeviceName} from 'react-native-device-info';
import {storage} from '@atb/modules/storage';
import {API_BASE_URL} from '@env';
import {getCurrentUserIdGlobal} from '@atb/modules/auth';
import {ErrorResponse} from '@atb-as/utils';
import {saveAttestationRequirement} from './attestation-requirement';

const CorrelationIdHeaderName = 'Atb-Correlation-Id';
const SignedTokenHeaderName = 'Atb-Signed-Token';
const AttestationHeaderName = 'Atb-Token-Attestation';
const AttestationTypeHeaderName = 'Atb-Token-Attestation-Type';
// Response header, axios gives response header names in lower case
const IsEmulatorHeaderName = 'Atb-Is-Emulator';

export type TokenService = {
  initiateNewMobileToken: InitiateNewMobileTokenType;
  activateNewMobileToken: ActivateNewMobileTokenType;
  initiateMobileTokenRenewal: InitiateMobileTokenRenewalType;
  completeMobileTokenRenewal: CompleteMobileTokenRenewalType;
  getMobileTokenDetails: GetMobileTokenDetailsType;
  reattestMobileToken: ReattestMobileTokenType;
  removeToken: (tokenId: string, traceId: string) => Promise<boolean>;
  /**
   * Returns the account's tokens. Also gives this device's token the
   * inspection right if no token has it.
   */
  listTokens: (
    secureContainer: string,
    traceId: string,
  ) => Promise<RemoteToken[]>;
  toggle: (tokenId: string, traceId: string) => Promise<RemoteToken[]>;
  getTokenToggleDetails: () => Promise<TokenLimitResponse>;
  postTokenStatus: (
    tokenId: string | undefined,
    tokenStatus: string,
    traceId: string | undefined,
  ) => Promise<void>;
};

/**
 * token-service returns errors as `{kind: 'TOKEN_NOT_FOUND', ...}`, while the
 * SDK's `parseRemoteError` expects `{errorName: '...'}`. Map the kinds the
 * server can return to the SDK error names.
 */
const ERROR_NAME_BY_KIND: Record<string, string> = {
  TOKEN_NOT_FOUND: 'TokenNotFoundRemoteTokenStateError',
  TOKEN_MUST_BE_REPLACED: 'TokenMustBeReplacedRemoteTokenStateError',
  TOKEN_MUST_BE_RENEWED: 'TokenMustBeRenewedRemoteTokenStateError',
  TOKEN_HAS_BEEN_RENEWED: 'TokenHasBeenRenewedRemoteTokenStateError',
  TOKEN_ENCODING_INVALID: 'TokenEncodingInvalidRemoteTokenStateError',
  TOKEN_PERMISSION_DENIED: 'TokenPermissionDeniedRemoteTokenStateError',
  TOKEN_STATE_CHANGE_ILLEGAL: 'TokenStateChangeIllegalRemoteTokenStateError',
  TOKEN_SECURITY_LEVEL_INSUFFICIENT:
    'TokenSecurityLevelInsufficientRemoteTokenStateError',
  TOKEN_DEVICE_ATTESTATION_VERIFICATION_FAILED:
    'TokenDeviceAttestationVerificationFailedRemoteTokenError',
  TOKEN_REATTESTATION_REQUIRED: 'TokenReattestationRemoteTokenStateError',
  TOKEN_ENCODING_CLOCK_SKEW: 'TokenEncodingClockSkewRemoteTokenStateError',
};

/**
 * Some errors carry data the SDK needs, in token-service's error details:
 * `{reattestation_data}` when the token must be re-attested, and
 * `{timestamp, duration}` for clock skew.
 */
const getErrorDetails = (err: ErrorResponse) => {
  const details = err.details?.[0];
  if (!details || typeof details !== 'object') return {};
  const {reattestation_data, ...rest} = details as Record<string, unknown>;
  return {...rest, reattestationData: reattestation_data};
};

/**
 * The SDK only treats `Error` instances as client errors, and only
 * `ClientNetworkError` as a temporary network problem, so never throw the
 * plain error object from the API client.
 */
const toSdkError = (err: ErrorResponse) => {
  if (err.kind === 'AXIOS_NETWORK_ERROR' || err.kind === 'AXIOS_TIMEOUT') {
    return new ClientNetworkError(err.message ?? 'Network error');
  }
  const errorName = err.kind ? ERROR_NAME_BY_KIND[err.kind] : undefined;
  const remoteError =
    errorName && parseRemoteError({...err, ...getErrorDetails(err), errorName});
  if (remoteError) return remoteError;
  return Object.assign(
    new Error(err.message ?? `Token service error: ${err.kind}`),
    {kind: err.kind, httpStatus: err.http?.code},
  );
};

const throwSdkError = (err: ErrorResponse): never => {
  throw toSdkError(err);
};

const getBaseUrl = async () => {
  const debugUrl = await storage.get('@ATB_debug_token_server_ip_address');
  const authId = getCurrentUserIdGlobal();
  if (debugUrl && debugUrl.length > 0) {
    client.defaults.headers.common['entur-customer-account-id'] =
      `ATB:CustomerAccount:${authId}`;
    return debugUrl;
  } else return API_BASE_URL;
};

export const tokenService: TokenService = {
  initiateNewMobileToken: async ({
    preferRequireAttestation,
    correlationId,
    deviceInfo,
    discardableTokenIds,
  }) => {
    const deviceName = await getDeviceName();
    const data: InitRequest = {
      name: deviceName,
      preferRequireAttestation,
      deviceInfo: deviceInfo.data,
      deviceInfoType: deviceInfo.type,
      discardableTokenIds,
    };
    return await client
      .post<InitiateTokenResponse>('/token/v1/init', data, {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [IsEmulatorHeaderName]: String(isEmulator()),
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      })
      .then((res) => res.data.pendingTokenDetails)
      .catch(throwSdkError);
  },
  activateNewMobileToken: async ({
    pendingTokenId,
    activationDetails,
    correlationId,
  }) => {
    const data: ActivateTokenRequest = {
      tokenId: pendingTokenId,
      attestationType: activationDetails.type,
      attestation: activationDetails.data,
    };
    return client
      .post<ActiveTokenResponse>('/token/v1/activate', data, {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      })
      .then((res) => res.data.activeTokenDetails)
      .catch(throwSdkError);
  },
  initiateMobileTokenRenewal: async ({secureContainer, correlationId}) =>
    client
      .post<RenewTokenResponse>('/token/v1/renew', undefined, {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [SignedTokenHeaderName]: secureContainer,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      })
      .then((res) => {
        saveAttestationRequirement(res.headers);
        return res.data.pendingTokenDetails;
      })
      .catch(throwSdkError),
  completeMobileTokenRenewal: async ({
    pendingTokenId,
    activationDetails,
    secureContainer,
    correlationId,
  }) => {
    const data: ActivateTokenRequest = {
      tokenId: pendingTokenId,
      attestationType: activationDetails.type,
      attestation: activationDetails.data,
    };
    return client
      .post<ActiveTokenResponse>('/token/v1/complete', data, {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [SignedTokenHeaderName]: secureContainer,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      })
      .then((res) => {
        saveAttestationRequirement(res.headers);
        return res.data.activeTokenDetails;
      })
      .catch(throwSdkError);
  },
  getMobileTokenDetails: async ({secureContainer, correlationId}) =>
    client
      .get<ActiveTokenResponse>('/token/v1/details', {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [SignedTokenHeaderName]: secureContainer,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      })
      .then((res) => {
        saveAttestationRequirement(res.headers, {reportSoon: true});
        return res.data.activeTokenDetails;
      })
      .catch(throwSdkError),
  /**
   * token-service re-attests the token when the details request has the
   * attestation.
   */
  reattestMobileToken: async ({
    secureContainer,
    reattestation,
    correlationId,
  }) =>
    client
      .get<ActiveTokenResponse>('/token/v1/details', {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [SignedTokenHeaderName]: secureContainer,
          ...(reattestation && {
            [AttestationHeaderName]: reattestation.data,
            [AttestationTypeHeaderName]: reattestation.type,
          }),
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      })
      .then((res) => {
        // Reported on the next token list, not right away: that list call
        // could make the SDK re-attest again, and get the requirement again
        saveAttestationRequirement(res.headers);
        return undefined;
      })
      .catch(throwSdkError),
  removeToken: async (tokenId: string, traceId: string): Promise<boolean> =>
    client
      .post<RemoveTokenResponse>(
        '/token/v1/remove',
        {tokenId},
        {
          headers: {
            [CorrelationIdHeaderName]: traceId,
          },
          baseURL: await getBaseUrl(),
          authWithIdToken: true,
          timeout: 15000,
        },
      )
      .then((res) => res.data.removed),
  listTokens: async (secureContainer, traceId) =>
    client
      .get<ListResponse>('/token/v1/list', {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [SignedTokenHeaderName]: secureContainer,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      })
      .then((res) => res.data.tokens)
      .catch(throwSdkError),
  toggle: async (tokenId: string, traceId: string) =>
    client
      .post<ToggleResponse>(
        '/token/v1/toggle',
        {tokenId},
        {
          headers: {
            [CorrelationIdHeaderName]: traceId,
          },
          baseURL: await getBaseUrl(),
          authWithIdToken: true,
          timeout: 15000,
        },
      )
      .then((res) => res.data.tokens),

  getTokenToggleDetails: async () =>
    client
      .get<TokenLimitResponse>('/token/v1/toggle/details', {
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      })
      .then((res) => res.data),
  postTokenStatus: async (tokenId, tokenStatus, traceId) => {
    await client.post(
      '/token/v1/status',
      {
        mobileTokenId: tokenId,
        mobileTokenStatus: tokenStatus,
        mobileTokenErrorCorrelationId: traceId,
      },
      {
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
      },
    );
  },
};
