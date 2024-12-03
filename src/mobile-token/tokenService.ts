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
import {RemoteTokenStateError} from '@entur-private/abt-token-server-javascript-interface';
import {getDeviceName} from 'react-native-device-info';
import {parseBffCallErrors} from './utils';
import {abtClient} from './mobileTokenClient';

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
};

const handleError = (err: any) => {
  throw parseBffCallErrors(err.response?.data) || err;
};

const isRemoteTokenStateError = (err: any) =>
  parseBffCallErrors(err.response?.data) instanceof RemoteTokenStateError;

export const tokenService: TokenService = {
  initiateNewMobileToken: async (traceId) => {
    const deviceName = await getDeviceName();
    const data: InitRequest = {
      name: deviceName,
    };
    return client
      .post<InitiateTokenResponse>('/tokens/v4/init', data, {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [IsEmulatorHeaderName]: String(await isEmulator()),
        },
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
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: isRemoteTokenStateError,
        },
      )
      .then((res) => res.data.activeTokenDetails)
      .catch(handleError),
  initiateMobileTokenRenewal: (token, secureContainer, correlationId) =>
    client
      .post<InitiateTokenRenewalResponse>('/tokens/v4/renew', undefined, {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [SignedTokenHeaderName]: secureContainer,
        },
        authWithIdToken: true,
        timeout: 15000,
        skipErrorLogging: isRemoteTokenStateError,
      })
      .then((res) => res.data.pendingTokenDetails)
      .catch(handleError),
  completeMobileTokenRenewal: (
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
          authWithIdToken: true,
          timeout: 15000,
          skipErrorLogging: isRemoteTokenStateError,
        },
      )
      .then((res) => res.data.activeTokenDetails)
      .catch(handleError),
  getMobileTokenDetails: (token, secureContainer, traceId) =>
    client
      .get<GetTokenDetailsResponse>('/tokens/v4/details', {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [SignedTokenHeaderName]: secureContainer,
        },
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

    await abtClient.remoteClientCallHandler(
      token.getContextId(),
      tokenEncodingRequest,
      traceId,
      async (secureContainerToken, attestation) => {
        client
          .get('/v4/validate', {
            headers: {
              [CorrelationIdHeaderName]: traceId,
              [SignedTokenHeaderName]: secureContainerToken,
              [AttestationHeaderName]: attestation?.data,
              [AttestationTypeHeaderName]: attestation?.type,
            },
            authWithIdToken: true,
            timeout: 15000,
            skipErrorLogging: isRemoteTokenStateError,
          })
          .catch(handleError);
      },
    );
  },
};
