import {
  ActivatedToken,
  isEmulator,
  RemoteTokenService,
  TokenAction,
  TokenEncodingRequest,
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
import {isRemoteTokenStateError, parseBffCallErrors} from './utils';
import {abtClient} from './mobileTokenClient';
import {
  TokenReattestationRemoteTokenStateError,
  TokenReattestationRequiredError,
} from '@entur-private/abt-token-server-javascript-interface';
import {storage} from '@atb/storage';
import {API_BASE_URL} from '@env';
import {getCurrentUserIdGlobal} from '@atb/auth/AuthContext';

const CorrelationIdHeaderName = 'Atb-Correlation-Id';
const SignedTokenHeaderName = 'Atb-Signed-Token';
const AttestationHeaderName = 'Atb-Token-Attestation';
const AttestationTypeHeaderName = 'Atb-Token-Attestation-Type';
const IsEmulatorHeaderName = 'Atb-Is-Emulator';

export type TokenService = RemoteTokenService & {
  removeToken: (tokenId: string, traceId: string) => Promise<boolean>;
  listTokens: (traceId: string) => Promise<RemoteToken[]>;
  toggle: (
    tokenId: string,
    traceId: string,
    bypassRestrictions: boolean,
  ) => Promise<RemoteToken[]>;
  validate: (token: ActivatedToken, traceId: string) => Promise<void>;
  getTokenToggleDetails: () => Promise<TokenLimitResponse>;
  postTokenStatus: (
    tokenId: string | undefined,
    tokenStatus: string,
    traceId: string | undefined,
  ) => Promise<void>;
};

const handleError = (err: any) => {
  throw parseBffCallErrors(err.response?.data);
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
    return await client
      .post<InitiateTokenResponse>('/tokens/v4/init', data, {
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
  activateNewMobileToken: async (pendingToken, correlationId) =>
    client
      .post<CompleteTokenInitializationResponse>(
        '/tokens/v4/activate',
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
      .catch(handleError),
  initiateMobileTokenRenewal: async (token, secureContainer, correlationId) =>
    client
      .post<InitiateTokenRenewalResponse>('/tokens/v4/renew', undefined, {
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
      .catch(handleError),
  completeMobileTokenRenewal: async (
    pendingToken,
    secureContainer,
    activatedToken,
    correlationId,
  ) =>
    client
      .post<CompleteTokenRenawalResponse>(
        '/tokens/v4/complete',
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
      .catch(handleError),
  reattestMobileToken: async (
    token,
    secureContainer,
    reattestation,
    correlationId,
  ) =>
    client
      .get<GetTokenDetailsResponse>('/tokens/v4/details', {
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
      .catch(handleError),
  getMobileTokenDetails: async (token, secureContainer, traceId) =>
    client
      .get<GetTokenDetailsResponse>('/tokens/v4/details', {
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
      .catch(handleError),
  removeToken: async (tokenId: string, traceId: string): Promise<boolean> =>
    client
      .post<RemoveTokenResponse>(
        '/tokens/v4/remove',
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
      .catch(handleError),
  listTokens: async (traceId: string) =>
    client
      .get<ListResponse>('/tokens/v4/list', {
        headers: {
          [CorrelationIdHeaderName]: traceId,
        },
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: isRemoteTokenStateError,
      })
      .then((res) => res.data.tokens)
      .catch(handleError),
  toggle: async (
    tokenId: string,
    traceId: string,
    bypassRestrictions: boolean,
  ) =>
    client
      .post<ToggleResponse>(
        '/tokens/v4/toggle',
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
      .catch(handleError),

  getTokenToggleDetails: async () =>
    client
      .get<TokenLimitResponse>('/tokens/v4/toggle/details', {
        baseURL: await getBaseUrl(),
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: isRemoteTokenStateError,
      })
      .then((res) => res.data)
      .catch(handleError),
  validate: async (token, traceId) => {
    const tokenEncodingRequest: TokenEncodingRequest = {
      challenges: [],
      tokenActions: [TokenAction.TOKEN_ACTION_GET_FARECONTRACTS],
      includeCertificate: false,
    };

    await abtClient
      .remoteClientCallHandler(
        token.getContextId(),
        tokenEncodingRequest,
        traceId,
        async (secureContainerToken, attestation) =>
          client
            .get('/tokens/v4/validate', {
              headers: {
                [CorrelationIdHeaderName]: traceId,
                [SignedTokenHeaderName]: secureContainerToken,
                [AttestationHeaderName]: attestation?.data,
                [AttestationTypeHeaderName]: attestation?.type,
              },
              baseURL: await getBaseUrl(),
              authWithIdToken: true,
              timeout: 15000,
              skipErrorLogging: isRemoteTokenStateError,
            })
            .catch((err) => {
              // for some reason, Reattestation must be handled here,
              // otherwise it will cause a reset, and we don't want that to happen
              // if we handle token Renewal here using `handleError`, the renewed
              // token will be invalid to use on inspection.
              const parsedError = parseBffCallErrors(err.response?.data);
              if (
                parsedError instanceof
                  TokenReattestationRemoteTokenStateError ||
                parsedError instanceof TokenReattestationRequiredError
              ) {
                throw parsedError;
              } else throw err;
            }),
      )
      .catch(handleError);
  },
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
