import {
  ActivatedToken,
  GrpcError,
  handleReattest,
  handleRemoteError,
  RemoteTokenServiceWithInitiate,
} from '@entur/abt-mobile-client-sdk';
import {
  ActivateResponse,
  CompleteResponse,
  DetailsResponse,
  InitRequest,
  InitResponse,
  RenewResponse,
} from '@entur/abt-token-server-node-lib/types';
import client from '@atb/api/client';
import {RemoteToken, RemoveResponse} from '@atb/mobile-token/types';
import axios from 'axios';
import {getDeviceName} from 'react-native-device-info';

const CorrelationIdHeaderName = 'Atb-Correlation-Id';
const SignedTokenHeaderName = 'Atb-Signed-Token';
const AttestationHeaderName = 'Atb-Token-Attestation';
const AttestationTypeHeaderName = 'Atb-Token-Attestation-Type';
const IsEmulatorHeaderName = 'Atb-Is-Emulator';

type ListTokensResponse = {
  tokens: RemoteToken[];
};

export type TokenService = RemoteTokenServiceWithInitiate & {
  removeToken: (tokenId: string, traceId: string) => Promise<boolean>;
  listTokens: (traceId: string) => Promise<RemoteToken[]>;
  toggle: (tokenId: string, traceId: string) => Promise<RemoteToken[]>;
  validate: (
    token: ActivatedToken,
    secureContainer: string,
    traceId: string,
  ) => Promise<void>;
};

const grpcErrorHandler = (err: any) => {
  if (axios.isAxiosError(err)) {
    const errorData = err.response?.data as any;
    if (errorData && 'grpcErrorCode' in errorData) {
      return Promise.reject(new GrpcError('TEST', errorData));
    }
  }
  return Promise.reject(err);
};

const service: TokenService = {
  initiateNewMobileToken: async (traceId, isEmulator) => {
    const deviceName = await getDeviceName();
    const data: InitRequest = {
      keyValues: [{key: 'deviceName', value: deviceName}],
    };
    return client
      .post<InitResponse>('/tokens/v3/init', data, {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [IsEmulatorHeaderName]: String(isEmulator),
        },
        authWithIdToken: true,
      })
      .then((res) => res.data.pendingTokenDetails)
      .catch(grpcErrorHandler);
  },
  activateNewMobileToken: async (pendingToken, correlationId) =>
    client
      .post<ActivateResponse>('/tokens/v3/activate', pendingToken.toJSON(), {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
        },
        authWithIdToken: true,
      })
      .then((res) => res.data.activeTokenDetails)
      .catch(grpcErrorHandler),
  initiateMobileTokenRenewal: (token, secureContainer, traceId, attestation) =>
    client
      .post<RenewResponse>('/tokens/v3/renew', undefined, {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [SignedTokenHeaderName]: secureContainer,
          [AttestationHeaderName]: attestation?.data || '',
          [AttestationTypeHeaderName]: attestation?.type || '',
        },
        authWithIdToken: true,
      })
      .then((res) => res.data.pendingTokenDetails)
      .catch(grpcErrorHandler),
  completeMobileTokenRenewal: (
    pendingToken,
    secureContainer,
    activatedToken,
    correlationId,
    attestation,
  ) =>
    client
      .post<CompleteResponse>('/tokens/v3/complete', pendingToken.toJSON(), {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
          [SignedTokenHeaderName]: secureContainer,
          [AttestationHeaderName]: attestation?.data || '',
          [AttestationTypeHeaderName]: attestation?.type || '',
        },
        authWithIdToken: true,
      })
      .then((res) => res.data.activeTokenDetails)
      .catch(grpcErrorHandler),
  getMobileTokenDetails: (token, secureContainer, traceId, attestation) =>
    client
      .get<DetailsResponse>('/tokens/v3/details', {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [SignedTokenHeaderName]: secureContainer,
          [AttestationHeaderName]: attestation?.data || '',
          [AttestationTypeHeaderName]: attestation?.type || '',
        },
        authWithIdToken: true,
      })
      .then((res) => res.data.activeTokenDetails)
      .catch(grpcErrorHandler),
  removeToken: async (tokenId: string, traceId: string): Promise<boolean> =>
    handleRemoteError(() =>
      client
        .post<RemoveResponse>(
          '/tokens/v3/remove',
          {tokenId},
          {
            headers: {
              [CorrelationIdHeaderName]: traceId,
            },
            authWithIdToken: true,
          },
        )
        .then((res) => res.data.removed)
        .catch(grpcErrorHandler),
    ),
  listTokens: async (traceId: string) =>
    handleRemoteError(() =>
      client
        .get<ListTokensResponse>('/tokens/v3/list', {
          headers: {
            [CorrelationIdHeaderName]: traceId,
          },
          authWithIdToken: true,
        })
        .then((res) => res.data.tokens)
        .catch(grpcErrorHandler),
    ),
  toggle: async (tokenId: string, traceId: string) =>
    handleRemoteError(() =>
      client
        .post<ListTokensResponse>(
          '/tokens/v3/toggle',
          {tokenId},
          {
            headers: {
              [CorrelationIdHeaderName]: traceId,
            },
            authWithIdToken: true,
          },
        )
        .then((res) => res.data.tokens)
        .catch(grpcErrorHandler),
    ),
  validate: async (token, secureContainer, traceId) =>
    handleReattest<any>(async (attestation) => {
      await client.get('/tokens/v3/validate', {
        headers: {
          [CorrelationIdHeaderName]: traceId,
          [SignedTokenHeaderName]: secureContainer,
          [AttestationHeaderName]: attestation?.data || '',
          [AttestationTypeHeaderName]: attestation?.type || '',
        },
        authWithIdToken: true,
      });
    }, token)
      .catch(grpcErrorHandler)
      .catch(handleRemoteError),
};

export default function createTokenService() {
  return service;
}
