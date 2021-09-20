import { Platform } from 'react-native';
import { addToken, attestLegacy } from '../native';
import type { Token } from '../native/types';
import type { Fetch, Hosts } from '../config';
import type {
  InitializeTokenRequest,
  InitializeTokenResponse,
  RenewTokenRequest,
  RenewTokenResponse,
  ActivateTokenRequest,
  ActivateTokenResponse,
} from './types';
import { RequestError } from '../fetcher';

const requireAttestation = Platform.select({
  default: true,
  ios: false,
});

enum AttestationType {
  SafetyNet = 'SafetyNet',
  iOS_Device_Check = 'iOS_Device_Check',
  iOS_Device_Attestation = 'iOS_Device_Attestation',
}

export function isTokenValid({
  tokenValidityStart,
  tokenValidityEnd,
}: Token): boolean {
  const now = Date.now();
  return tokenValidityStart < now && now < tokenValidityEnd;
}

function createAttestActivateAdd(fetcher: Fetch, hosts: Hosts) {
  const activateTokenRequest = async (
    tokenId: string,
    body: ActivateTokenRequest
  ): Promise<ActivateTokenResponse> => {
    const url = `${hosts.pto}/tokens/${tokenId}/activate`;

    const response = await fetcher<ActivateTokenResponse>({
      url,
      body,
      method: 'POST',
    });

    return response.body;
  };

  return async (
    initialTokenId: string,
    nonce: string,
    serverPublicKey: string
  ): Promise<Token> => {
    try {
      const {
        attestation,
        signaturePublicKey,
        encryptionPublicKey,
        attestationEncryptionKey,
      } = await attestLegacy(initialTokenId, nonce, serverPublicKey);

      const {
        certificate,
        tokenId,
        tokenValidityEnd,
        tokenValidityStart,
      } = await activateTokenRequest(initialTokenId, {
        signaturePublicKey,
        encryptionPublicKey,
        attestation:
          Platform.OS === 'ios'
            ? {
                attestationType: AttestationType.iOS_Device_Check,
                encryptedIosDeviceCheckData: attestation,
                attestationEncryptionEncryptedKey: attestationEncryptionKey,
              }
            : {
                attestationType: AttestationType.SafetyNet,
                safetyNetJws: attestation,
                signaturePublicKeyAttestation: ['noop'], // TODO: erstatt med faktiske verdier
                encryptionPublicKeyAttestation: ['noop'], // TODO: erstatt med faktiske verdier
              },
      });

      if (tokenId !== initialTokenId)
        throw Error(
          `Activated token ${tokenId} does not match initial token ${initialTokenId}`
        );

      await addToken(
        tokenId,
        certificate,
        tokenValidityStart,
        tokenValidityEnd
      );

      return { tokenId, tokenValidityStart, tokenValidityEnd };
    } catch (err) {
      if (err instanceof RequestError) {
        const { response } = err;
        console.error(response.body);
      } else {
        console.error(err);
      }
      throw err;
    }
  };
}

export function createRenewToken(fetcher: Fetch, hosts: Hosts) {
  const attestActivateAdd = createAttestActivateAdd(fetcher, hosts);

  const renewTokenRequest = async (
    tokenId: string,
    body: RenewTokenRequest
  ): Promise<RenewTokenResponse> => {
    const url = `${hosts.pto}/tokens/${tokenId}`;

    const response = await fetcher<RenewTokenResponse>({
      url,
      body,
      method: 'POST',
    });

    return response.body;
  };

  return async (token: Token): Promise<Token> => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey,
    } = await renewTokenRequest(token.tokenId, { requireAttestation });

    return attestActivateAdd(tokenId, nonce, attestationEncryptionPublicKey);
  };
}

export function createInitToken(fetcher: Fetch, hosts: Hosts) {
  const attestActivateAdd = createAttestActivateAdd(fetcher, hosts);

  const initTokenRequest = async (
    body: InitializeTokenRequest
  ): Promise<InitializeTokenResponse> => {
    const url = `${hosts.pto}/tokens`;

    const response = await fetcher<InitializeTokenResponse>({
      url,
      body,
      method: 'POST',
    });

    return response.body;
  };

  return async (): Promise<Token> => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey,
    } = await initTokenRequest({ requireAttestation });

    return attestActivateAdd(tokenId, nonce, attestationEncryptionPublicKey);
  };
}
