"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReattestation = exports.getActivateTokenRequestBody = void 0;

var _reactNative = require("react-native");

var _native = require("../native");

var AttestationType;

(function (AttestationType) {
  AttestationType["SafetyNet"] = "SafetyNet";
  AttestationType["iOS_Device_Check"] = "iOS_Device_Check";
  AttestationType["iOS_Device_Attestation"] = "iOS_Device_Attestation";
})(AttestationType || (AttestationType = {}));

const getActivateTokenRequestBody = (accountId, initialTokenId, nonce, serverPublicKey) => {
  if (_reactNative.Platform.OS === 'ios') {
    const iosVersion = typeof _reactNative.Platform.Version === 'string' ? parseFloat(_reactNative.Platform.Version) : _reactNative.Platform.Version;

    if (iosVersion >= 14) {
      return getActivateTokenRequestBodyIos14(accountId, initialTokenId, nonce);
    } else {
      return getActivateTokenRequestBodyIos11(accountId, initialTokenId, nonce, serverPublicKey);
    }
  } else {
    return getActivateTokenRequestBodyAndroid(accountId, initialTokenId, nonce);
  }
};

exports.getActivateTokenRequestBody = getActivateTokenRequestBody;

const getActivateTokenRequestBodyAndroid = async (accountId, initialTokenId, nonce) => {
  const {
    attestationObject,
    signaturePublicKey,
    encryptionPublicKey,
    signatureChain,
    encryptionChain
  } = await (0, _native.attest)(accountId, initialTokenId, nonce);
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
  } = await (0, _native.attestLegacy)(accountId, initialTokenId, nonce, serverPublicKey);
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
  } = await (0, _native.attest)(accountId, initialTokenId, nonce);
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

const getReattestation = async (accountId, tokenId, nonce) => {
  const {
    attestationObject
  } = await (0, _native.reattest)(accountId, tokenId, nonce);
  return {
    attestationType: 'SafetyNet',
    safetyNetJws: attestationObject,
    signaturePublicKeyAttestation: [],
    encryptionPublicKeyAttestation: []
  };
};

exports.getReattestation = getReattestation;
//# sourceMappingURL=attest.js.map