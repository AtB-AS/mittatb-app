import { Platform } from 'react-native';
import type { ActivateTokenRequest } from './types';
import { attest, attestLegacy } from '../native';

enum AttestationType {
  SafetyNet = 'SafetyNet',
  iOS_Device_Check = 'iOS_Device_Check',
  iOS_Device_Attestation = 'iOS_Device_Attestation',
}

export const getActivateTokenRequestBody = (
  accountId: string,
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
      return getActivateTokenRequestBodyIos14(accountId, initialTokenId, nonce);
    } else {
      return getActivateTokenRequestBodyIos11(
        accountId,
        initialTokenId,
        nonce,
        serverPublicKey
      );
    }
  } else {
    return getActivateTokenRequestBodyAndroid(accountId, initialTokenId, nonce);
  }
};

const getActivateTokenRequestBodyAndroid = async (
  accountId: string,
  initialTokenId: string,
  nonce: string
): Promise<ActivateTokenRequest> => {
  const {
    attestationObject,
    signaturePublicKey,
    encryptionPublicKey,
    signatureChain,
    encryptionChain,
  } = await attest(accountId, initialTokenId, nonce);

  return {
    signaturePublicKey,
    encryptionPublicKey,
    attestation: {
      attestationType: AttestationType.SafetyNet,
      safetyNetJws: attestationObject,
      signaturePublicKeyAttestation: signatureChain, // TODO: erstatt med faktiske verdier
      encryptionPublicKeyAttestation: encryptionChain, // TODO: erstatt med faktiske verdier
    },
  };
};

const getActivateTokenRequestBodyIos11 = async (
  accountId: string,
  initialTokenId: string,
  nonce: string,
  serverPublicKey: string
): Promise<ActivateTokenRequest> => {
  const {
    attestation,
    signaturePublicKey,
    encryptionPublicKey,
    attestationEncryptionKey,
  } = await attestLegacy(accountId, initialTokenId, nonce, serverPublicKey);

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
  accountId: string,
  initialTokenId: string,
  nonce: string
): Promise<ActivateTokenRequest> => {
  const {
    attestationObject,
    keyId,
    deviceAttestationData,
    signaturePublicKey,
    encryptionPublicKey,
  } = await attest(accountId, initialTokenId, nonce);

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
