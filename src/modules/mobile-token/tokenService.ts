import {
  isEmulator,
  RemoteTokenService,
} from '@entur-private/abt-mobile-client-sdk';

import {client} from '@atb/api/client';
import {
  CompleteTokenInitializationResponse,
  CompleteTokenRenawalResponse,
  GetTokenDetailsResponse,
  InitiateTokenRenewalResponse,
  InitiateTokenResponse,
  InitRequest,
  ListResponse,
  RemoteToken,
  RemoveTokenResponse,
  ToggleResponse,
  TokenLimitResponse,
} from './types';
import {getDeviceName} from 'react-native-device-info';
import {isRemoteTokenStateError, parseTokenServerErrors} from './utils';
import {storage} from '@atb/modules/storage';
import {API_BASE_URL} from '@env';
import {getCurrentUserIdGlobal} from '@atb/modules/auth';

const CorrelationIdHeaderName = 'Atb-Correlation-Id';
const SignedTokenHeaderName = 'Atb-Signed-Token';
const AttestationHeaderName = 'Atb-Token-Attestation';
const AttestationTypeHeaderName = 'Atb-Token-Attestation-Type';
const IsEmulatorHeaderName = 'Atb-Is-Emulator';

export type TokenService = RemoteTokenService & {
  removeToken: (tokenId: string, traceId: string) => Promise<boolean>;
  listTokens: (
    secureContainer: string | undefined,
    traceId: string,
  ) => Promise<RemoteToken[]>;
  toggle: (
    tokenId: string,
    traceId: string,
    bypassRestrictions: boolean,
  ) => Promise<RemoteToken[]>;
  getTokenToggleDetails: () => Promise<TokenLimitResponse>;
  postTokenStatus: (
    tokenId: string | undefined,
    tokenStatus: string,
    traceId: string | undefined,
  ) => Promise<void>;
};

const handleError = (err: any) => {
  throw parseTokenServerErrors(err.response?.data);
};

const getBaseUrl = async () => {
  const debugUrl = await storage.get('@ATB_debug_token_server_ip_address');
  const authId = getCurrentUserIdGlobal();
  if (debugUrl && debugUrl.length > 0) {
    client.defaults.headers.common[
      'entur-customer-account-id'
    ] = `ATB:CustomerAccount:${authId}`;
    return debugUrl;
  } else return API_BASE_URL;
};

export const tokenService: TokenService = {
  initiateNewMobileToken: async (
    preferRequireAttestation,
    traceId,
    deviceInfo,
  ) => {
    const deviceName = await getDeviceName();
    const data: InitRequest = {
      name: deviceName,
      preferRequireAttestation: preferRequireAttestation,
      deviceInfo: deviceInfo.data,
      deviceInfoType: deviceInfo.type,
    };
    console.log('Initiating new mobile token with data:', data);
    return await client
      .post<InitiateTokenResponse>('/token/v1/init', data, {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [IsEmulatorHeaderName]: String(await isEmulator()),
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        skipErrorLogging: isRemoteTokenStateError,
        timeout: 15000,
      })
      .then((res) => res.data.pendingTokenDetails)
      .catch(handleError);
  },
  activateNewMobileToken: async (pendingToken, correlationId) => {
    console.log('Activating new mobile token with pendingToken:', pendingToken);
    return client
      .post<CompleteTokenInitializationResponse>(
        '/token/v1/activate',
        pendingToken.toJSON(),
        {
          headers: {
            [CorrelationIdHeaderName]: correlationId,
          },
          baseURL: await getBaseUrl(),
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: isRemoteTokenStateError,
        },
      )
      .then((res) => res.data.activeTokenDetails)
      .catch(handleError);
  },
  initiateMobileTokenRenewal: async (token, secureContainer, correlationId) => {
    console.log('Initiating mobile token renewal with token:', token);
    return client
      .post<InitiateTokenRenewalResponse>('/token/v1/renew', undefined, {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [SignedTokenHeaderName]: secureContainer,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: isRemoteTokenStateError,
      })
      .then((res) => res.data.pendingTokenDetails)
      .catch(handleError);
  },
  completeMobileTokenRenewal: async (
    pendingToken,
    secureContainer,
    activatedToken,
    correlationId,
  ) => {
    console.log(
      'Completing mobile token renewal with pendingToken:',
      pendingToken,
    );
    return client
      .post<CompleteTokenRenawalResponse>(
        '/token/v1/complete',
        pendingToken.toJSON(),
        {
          headers: {
            [CorrelationIdHeaderName]: correlationId,
            [SignedTokenHeaderName]: secureContainer,
          },
          baseURL: await getBaseUrl(),
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: isRemoteTokenStateError,
        },
      )
      .then((res) => res.data.activeTokenDetails)
      .catch(handleError);
  },
  reattestMobileToken: async (
    token,
    secureContainer,
    reattestation,
    correlationId,
  ) => {
    console.log('Reattesting mobile token with token:', token);
    return client
      .get<GetTokenDetailsResponse>('/token/v1/details', {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [SignedTokenHeaderName]: secureContainer,
          [AttestationHeaderName]: reattestation.data,
          [AttestationTypeHeaderName]: reattestation.type,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: isRemoteTokenStateError,
      })
      .then(() => {})
      .catch(handleError);
  },
  getMobileTokenDetails: async (token, secureContainer, traceId) => {
    console.log('Getting mobile token details with token:', token);
    return client
      .get<GetTokenDetailsResponse>('/token/v1/details', {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [SignedTokenHeaderName]: secureContainer,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: isRemoteTokenStateError,
      })
      .then((res) => res.data.activeTokenDetails)
      .catch(handleError);
  },
  removeToken: async (tokenId: string, traceId: string): Promise<boolean> => {
    console.log('Removing token with ID:', tokenId);
    return client
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
          skipErrorLogging: isRemoteTokenStateError,
        },
      )
      .then((res) => res.data.removed)
      .catch(handleError);
  },
  listTokens: async (secureContainer, traceId) => {
    console.log('Listing tokens with secureContainer:', secureContainer);
    return client
      .get<ListResponse>('/token/v1/list', {
        headers: {
          [SignedTokenHeaderName]: secureContainer,
          [CorrelationIdHeaderName]: traceId,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: isRemoteTokenStateError,
      })
      .then((res) => res.data.tokens)
      .catch(handleError);
  },
  toggle: async (
    tokenId: string,
    traceId: string,
    bypassRestrictions: boolean,
  ) => {
    console.log(
      'Toggling token with ID:',
      tokenId,
      'bypassRestrictions:',
      bypassRestrictions,
    );
    return client
      .post<ToggleResponse>(
        '/token/v1/toggle',
        {tokenId, bypassRestrictions},
        {
          headers: {
            [CorrelationIdHeaderName]: traceId,
          },
          baseURL: await getBaseUrl(),
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: isRemoteTokenStateError,
        },
      )
      .then((res) => res.data.tokens)
      .catch(handleError);
  },

  getTokenToggleDetails: async () => {
    console.log('Getting token toggle details');
    return client
      .get<TokenLimitResponse>('/token/v1/toggle/details', {
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: isRemoteTokenStateError,
      })
      .then((res) => res.data)
      .catch(handleError);
  },
  postTokenStatus: async (tokenId, tokenStatus, traceId) => {
    console.log(
      'Posting token status with ID:',
      tokenId,
      'status:',
      tokenStatus,
      'traceId:',
      traceId,
    );
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
