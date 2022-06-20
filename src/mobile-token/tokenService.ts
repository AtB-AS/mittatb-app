import {RemoteTokenService} from '@entur/atb-mobile-client-sdk/token/token-state-react-native-lib/src';
import client from '@atb/api/client';
import {
  ActivateResponse,
  CompleteResponse,
  DetailsResponse,
  InitRequest,
  InitResponse,
  RenewResponse,
} from '../../.yalc/@entur/atb-mobile-client-sdk/token/token-server-node-lib/types';
import {RemoteToken, RemoveResponse} from '@atb/mobile-token/types';
import {ActivatedToken} from '@entur/atb-mobile-client-sdk/token/token-core-javascript-lib/src';
import {
  GrpcError,
  reattestHandler,
} from '../../.yalc/@entur/atb-mobile-client-sdk/token/token-state-react-native-lib/src';
import {handleRemoteError} from '../../.yalc/@entur/atb-mobile-client-sdk/token/token-state-react-native-lib/src/state/remote/utils';
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

export type TokenService = RemoteTokenService & {
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
      .post<InitResponse>('/tokens/v1/init', data, {
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
      .post<ActivateResponse>('/tokens/v1/activate', pendingToken.toJSON(), {
        headers: {
          [CorrelationIdHeaderName]: correlationId,
        },
        authWithIdToken: true,
      })
      .then((res) => res.data.activeTokenDetails)
      .catch(grpcErrorHandler),
  initiateMobileTokenRenewal: (token, secureContainer, traceId, attestation) =>
    client
      .post<RenewResponse>('/tokens/v1/renew', undefined, {
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
      .post<CompleteResponse>('/tokens/v1/complete', pendingToken.toJSON(), {
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
      .get<DetailsResponse>('/tokens/v1/details', {
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
    client
      .post<RemoveResponse>(
        '/tokens/v1/remove',
        {tokenId},
        {
          headers: {
            [CorrelationIdHeaderName]: traceId,
          },
          authWithIdToken: true,
        },
      )
      .then((res) => res.data.removed)
      .catch(grpcErrorHandler)
      .catch(handleRemoteError),
  listTokens: async (traceId: string) =>
    client
      .get<ListTokensResponse>('/tokens/v1/list', {
        headers: {
          [CorrelationIdHeaderName]: traceId,
        },
        authWithIdToken: true,
      })
      .then((res) => res.data.tokens)
      .catch(grpcErrorHandler)
      .catch(handleRemoteError),
  toggle: async (tokenId: string, traceId: string) =>
    client
      .post<ListTokensResponse>(
        '/tokens/v1/toggle',
        {tokenId},
        {
          headers: {
            [CorrelationIdHeaderName]: traceId,
          },
          authWithIdToken: true,
        },
      )
      .then((res) => res.data.tokens)
      .catch(grpcErrorHandler)
      .catch(handleRemoteError),
  validate: async (token, secureContainer, traceId) =>
    reattestHandler(async (attestation) => {
      await client.get('/tokens/v1/validate', {
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
