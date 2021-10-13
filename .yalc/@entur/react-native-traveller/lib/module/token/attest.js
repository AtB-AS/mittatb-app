import { Platform } from 'react-native';
import { attest, attestLegacy } from '../native';
var AttestationType;

(function (AttestationType) {
  AttestationType["SafetyNet"] = "SafetyNet";
  AttestationType["iOS_Device_Check"] = "iOS_Device_Check";
  AttestationType["iOS_Device_Attestation"] = "iOS_Device_Attestation";
})(AttestationType || (AttestationType = {}));

export const getActivateTokenRequestBody = (initialTokenId, nonce, serverPublicKey) => {
  if (Platform.OS === 'ios') {
    const iosVersion = typeof Platform.Version === 'string' ? parseFloat(Platform.Version) : Platform.Version;

    if (iosVersion >= 14) {
      return getActivateTokenRequestBodyIos14(initialTokenId, nonce);
    } else {
      return getActivateTokenRequestBodyIos11(initialTokenId, nonce, serverPublicKey);
    }
  } else {
    return getActivateTokenRequestBodyAndroid(initialTokenId, nonce, serverPublicKey);
  }
};

const getActivateTokenRequestBodyAndroid = async (initialTokenId, nonce, serverPublicKey) => {
  const {
    attestation,
    signaturePublicKey,
    encryptionPublicKey
  } = await attestLegacy(initialTokenId, nonce, serverPublicKey);
  return {
    signaturePublicKey,
    encryptionPublicKey,
    attestation: {
      attestationType: AttestationType.SafetyNet,
      safetyNetJws: attestation,
      signaturePublicKeyAttestation: ['noop'],
      // TODO: erstatt med faktiske verdier
      encryptionPublicKeyAttestation: ['noop'] // TODO: erstatt med faktiske verdier

    }
  };
};

const getActivateTokenRequestBodyIos11 = async (initialTokenId, nonce, serverPublicKey) => {
  const {
    attestation,
    signaturePublicKey,
    encryptionPublicKey,
    attestationEncryptionKey
  } = await attestLegacy(initialTokenId, nonce, serverPublicKey);
  return {
    signaturePublicKey,
    encryptionPublicKey,
    attestation: {
      attestationType: AttestationType.iOS_Device_Check,
      encryptedIosDeviceCheckData: attestation,
      attestationEncryptionEncryptedKey: attestationEncryptionKey
    }
  };
};

const getActivateTokenRequestBodyIos14 = async (initialTokenId, nonce) => {
  const {
    attestationObject,
    keyId,
    deviceAttestationData,
    signaturePublicKey,
    encryptionPublicKey
  } = await attest(initialTokenId, nonce);
  return {
    signaturePublicKey,
    encryptionPublicKey,
    attestation: {
      attestationType: AttestationType.iOS_Device_Attestation,
      attestationObject: attestationObject,
      keyId: keyId,
      deviceAttestationData: deviceAttestationData
    }
  };
};
//# sourceMappingURL=attest.js.map