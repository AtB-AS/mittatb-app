import { Platform } from 'react-native';
import { addToken, attest, attestLegacy } from '../native';
import type { Token } from '../native/types';
import type { Fetch, Hosts } from '../config';
import type {
  ActivateTokenRequest,
  ActivateTokenResponse,
  InitializeTokenRequest,
  InitializeTokenResponse,
  RenewTokenRequest,
  RenewTokenResponse,
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
      const activateTokenRequestBody = await getActivateTokenRequestBody(
        initialTokenId,
        nonce,
        serverPublicKey
      );

      const {
        certificate,
        tokenId,
        tokenValidityEnd,
        tokenValidityStart,
      } = await activateTokenRequest(initialTokenId, activateTokenRequestBody);

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

const getActivateTokenRequestBody = (
  initialTokenId: string,
  nonce: string,
  serverPublicKey: string
) => {
  if (Platform.OS === 'ios') {
    const iosVersion =
      typeof Platform.Version === 'string'
        ? parseFloat(Platform.Version)
        : Platform.Version;
    if (iosVersion >= 14) {
      return getActivateTokenRequestBodyIos14(initialTokenId, nonce);
    } else {
      return getActivateTokenRequestBodyIos11(
        initialTokenId,
        nonce,
        serverPublicKey
      );
    }
  } else {
    return getActivateTokenRequestBodyAndroid(
      initialTokenId,
      nonce,
      serverPublicKey
    );
  }
};

const getActivateTokenRequestBodyAndroid = async (
  initialTokenId: string,
  nonce: string,
  serverPublicKey: string
): Promise<ActivateTokenRequest> => {
  const {
    attestation,
    signaturePublicKey,
    encryptionPublicKey,
  } = await attestLegacy(initialTokenId, nonce, serverPublicKey);

  return {
    signaturePublicKey,
    encryptionPublicKey,
    attestation: {
      attestationType: AttestationType.SafetyNet,
      safetyNetJws: attestation,
      signaturePublicKeyAttestation: ['noop'], // TODO: erstatt med faktiske verdier
      encryptionPublicKeyAttestation: ['noop'], // TODO: erstatt med faktiske verdier
    },
  };
};

const getActivateTokenRequestBodyIos11 = async (
  initialTokenId: string,
  nonce: string,
  serverPublicKey: string
): Promise<ActivateTokenRequest> => {
  const {
    attestation,
    signaturePublicKey,
    encryptionPublicKey,
    attestationEncryptionKey,
  } = await attestLegacy(initialTokenId, nonce, serverPublicKey);

  return {
    signaturePublicKey,
    encryptionPublicKey,
    attestation: {
      attestationType: AttestationType.iOS_Device_Check,
      encryptedIosDeviceCheckData: attestation,
      attestationEncryptionEncryptedKey: attestationEncryptionKey,
    },
  };
};

const getActivateTokenRequestBodyIos14 = async (
  initialTokenId: string,
  nonce: string
): Promise<ActivateTokenRequest> => {
  const {
    attestationObject,
    keyId,
    deviceAttestationData,
    signaturePublicKey,
    encryptionPublicKey,
  } = await attest(initialTokenId, nonce);

  return {
    signaturePublicKey,
    encryptionPublicKey,
    attestation: {
      attestationType: AttestationType.iOS_Device_Attestation,
      attestationObject: attestationObject,
      keyId: keyId,
      deviceAttestationData: deviceAttestationData,
    },
  };
};

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
