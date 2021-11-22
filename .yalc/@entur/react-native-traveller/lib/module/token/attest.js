import { Platform } from 'react-native';
import { attest, attestLegacy } from '../native';
var AttestationType;

(function (AttestationType) {
  AttestationType["SafetyNet"] = "SafetyNet";
  AttestationType["iOS_Device_Check"] = "iOS_Device_Check";
  AttestationType["iOS_Device_Attestation"] = "iOS_Device_Attestation";
})(AttestationType || (AttestationType = {}));

export const getActivateTokenRequestBody = (accountId, initialTokenId, nonce, serverPublicKey) => {
  if (Platform.OS === 'ios') {
    const iosVersion = typeof Platform.Version === 'string' ? parseFloat(Platform.Version) : Platform.Version;

    if (iosVersion >= 14) {
      return getActivateTokenRequestBodyIos14(accountId, initialTokenId, nonce);
    } else {
      return getActivateTokenRequestBodyIos11(accountId, initialTokenId, nonce, serverPublicKey);
    }
  } else {
    return getActivateTokenRequestBodyAndroid(accountId, initialTokenId, nonce);
  }
};

const getActivateTokenRequestBodyAndroid = async (accountId, initialTokenId, nonce) => {
  const {
    attestationObject,
    signaturePublicKey,
    encryptionPublicKey,
    signatureChain,
    encryptionChain
  } = await attest(accountId, initialTokenId, nonce);
  return {
    signaturePublicKey,
    encryptionPublicKey,
    attestation: {
      attestationType: AttestationType.SafetyNet,
      safetyNetJws: attestationObject,
      signaturePublicKeyAttestation: signatureChain,
      // TODO: erstatt med faktiske verdier
      encryptionPublicKeyAttestation: encryptionChain // TODO: erstatt med faktiske verdier

    }
  };
};

const getActivateTokenRequestBodyIos11 = async (accountId, initialTokenId, nonce, serverPublicKey) => {
  const {
    attestation,
    signaturePublicKey,
    encryptionPublicKey,
    attestationEncryptionKey
  } = await attestLegacy(accountId, initialTokenId, nonce, serverPublicKey);
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

const getActivateTokenRequestBodyIos14 = async (accountId, initialTokenId, nonce) => {
  const {
    attestationObject,
    keyId,
    deviceAttestationData,
    signaturePublicKey,
    encryptionPublicKey
  } = await attest(accountId, initialTokenId, nonce);
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