import {
  ActivatedToken,
  handleRemoteTokenStateError,
  RemoteTokenServiceWithInitiate,
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
} from '@atb/mobile-token/types';
import {parseRemoteError} from '@entur-private/abt-token-server-javascript-interface';
import {getDeviceName} from 'react-native-device-info';

const CorrelationIdHeaderName = 'Atb-Correlation-Id';
const SignedTokenHeaderName = 'Atb-Signed-Token';
const AttestationHeaderName = 'Atb-Token-Attestation';
const AttestationTypeHeaderName = 'Atb-Token-Attestation-Type';
const IsEmulatorHeaderName = 'Atb-Is-Emulator';

export type TokenService = RemoteTokenServiceWithInitiate & {
  removeToken: (tokenId: string, traceId: string) => Promise<boolean>;
  listTokens: (traceId: string) => Promise<RemoteToken[]>;
  toggle: (tokenId: string, traceId: string) => Promise<RemoteToken[]>;
  validate: (
    token: ActivatedToken,
    secureContainer: string,
    traceId: string,
  ) => Promise<void>;
  getTokenToggleDetails: () => Promise<TokenLimitResponse>;
};

const handleError = (err: any) => {
  throw parseRemoteError(err.response?.data) || err;
};

const service: TokenService = {
  initiateNewMobileToken: async (traceId, isEmulator) => {
    const deviceName = await getDeviceName();
    const data: InitRequest = {
      name: deviceName,
    };
    return client
      .post<InitiateTokenResponse>('/tokens/v4/init', data, {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [IsEmulatorHeaderName]: String(isEmulator),
        },
        authWithIdToken: true,
        skipErrorLogging: () => false, //TODO: fix this
        timeout: 15000,
        baseURL: 'http://10.100.1.46:8080',
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
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: () => false, //TODO: fix this
          baseURL: 'http://10.100.1.46:8080',
        },
      )
      .then((res) => res.data.activeTokenDetails)
      .catch(handleError),
  initiateMobileTokenRenewal: (token, secureContainer, traceId, attestation) =>
    client
      .post<InitiateTokenRenewalResponse>('/tokens/v4/renew', undefined, {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [SignedTokenHeaderName]: secureContainer,
          [AttestationHeaderName]: attestation?.data || '',
          [AttestationTypeHeaderName]: attestation?.type || '',
        },
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: () => false, //TODO: fix this
        baseURL: 'http://10.100.1.46:8080',
      })
      .then((res) => res.data.pendingTokenDetails)
      .catch(handleError),
  completeMobileTokenRenewal: (
    pendingToken,
    secureContainer,
    activatedToken,
    correlationId,
    attestation,
  ) =>
    client
      .post<CompleteTokenRenawalResponse>(
        '/tokens/v4/complete',
        pendingToken.toJSON(),
        {
          headers: {
            [CorrelationIdHeaderName]: correlationId,
            [SignedTokenHeaderName]: secureContainer,
            [AttestationHeaderName]: attestation?.data || '',
            [AttestationTypeHeaderName]: attestation?.type || '',
          },
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: () => false, //TODO: fix this
          baseURL: 'http://10.100.1.46:8080',
        },
      )
      .then((res) => res.data.activeTokenDetails)
      .catch(handleError),
  getMobileTokenDetails: (token, secureContainer, traceId, attestation) =>
    client
      .get<GetTokenDetailsResponse>('/tokens/v4/details', {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [SignedTokenHeaderName]: secureContainer,
          [AttestationHeaderName]: attestation?.data || '',
          [AttestationTypeHeaderName]: attestation?.type || '',
        },
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: () => false, //TODO: fix this
        baseURL: 'http://10.100.1.46:8080',
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
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: () => false, //TODO: fix this
          baseURL: 'http://10.100.1.46:8080',
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
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: () => false, //TODO: fix this
        baseURL: 'http://10.100.1.46:8080',
      })
      .then((res) => res.data.tokens)
      .catch(handleError),
  toggle: async (tokenId: string, traceId: string) =>
    client
      .post<ToggleResponse>(
        '/tokens/v4/toggle',
        {tokenId},
        {
          headers: {
            [CorrelationIdHeaderName]: traceId,
          },
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: () => false, //TODO: fix this
          baseURL: 'http://10.100.1.46:8080',
        },
      )
      .then((res) => res.data.tokens)
      .catch(handleError),

  getTokenToggleDetails: async () =>
    client
      .get<TokenLimitResponse>('/tokens/v4/toggle/details', {
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: () => false, //TODO: fix this
        baseURL: 'http://10.100.1.46:8080',
      })
      .then((res) => res.data)
      .catch(handleError),
  validate: async (token, secureContainer, traceId) =>
    handleRemoteTokenStateError<any>(async (attestation) => {
      return client
        .get('/tokens/v4/validate', {
          headers: {
            [CorrelationIdHeaderName]: traceId,
            [SignedTokenHeaderName]: secureContainer,
            [AttestationHeaderName]: attestation?.data || '',
            [AttestationTypeHeaderName]: attestation?.type || '',
          },
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: () => false, //TODO: fix this
          baseURL: 'http://10.100.1.46:8080',
        })
        .catch(handleError);
    }, token),
};

export function createTokenService() {
  return service;
}
