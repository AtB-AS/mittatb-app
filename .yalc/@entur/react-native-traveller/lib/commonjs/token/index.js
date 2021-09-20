"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTokenValid = isTokenValid;
exports.createRenewToken = createRenewToken;
exports.createInitToken = createInitToken;

var _reactNative = require("react-native");

var _native = require("../native");

var _fetcher = require("../fetcher");

const requireAttestation = _reactNative.Platform.select({
  default: true,
  ios: false
});

var AttestationType;

(function (AttestationType) {
  AttestationType["SafetyNet"] = "SafetyNet";
  AttestationType["iOS_Device_Check"] = "iOS_Device_Check";
  AttestationType["iOS_Device_Attestation"] = "iOS_Device_Attestation";
})(AttestationType || (AttestationType = {}));

function isTokenValid({
  tokenValidityStart,
  tokenValidityEnd
}) {
  const now = Date.now();
  return tokenValidityStart < now && now < tokenValidityEnd;
}

function createAttestActivateAdd(fetcher, hosts) {
  const activateTokenRequest = async (tokenId, body) => {
    const url = `${hosts.pto}/tokens/${tokenId}/activate`;
    const response = await fetcher({
      url,
      body,
      method: 'POST'
    });
    return response.body;
  };

  return async (initialTokenId, nonce, serverPublicKey) => {
    try {
      const {
        attestation,
        signaturePublicKey,
        encryptionPublicKey,
        attestationEncryptionKey
      } = await (0, _native.attestLegacy)(initialTokenId, nonce, serverPublicKey);
      const {
        certificate,
        tokenId,
        tokenValidityEnd,
        tokenValidityStart
      } = await activateTokenRequest(initialTokenId, {
        signaturePublicKey,
        encryptionPublicKey,
        attestation: _reactNative.Platform.OS === 'ios' ? {
          attestationType: AttestationType.iOS_Device_Check,
          encryptedIosDeviceCheckData: attestation,
          attestationEncryptionEncryptedKey: attestationEncryptionKey
        } : {
          attestationType: AttestationType.SafetyNet,
          safetyNetJws: attestation,
          signaturePublicKeyAttestation: ['noop'],
          // TODO: erstatt med faktiske verdier
          encryptionPublicKeyAttestation: ['noop'] // TODO: erstatt med faktiske verdier

        }
      });
      if (tokenId !== initialTokenId) throw Error(`Activated token ${tokenId} does not match initial token ${initialTokenId}`);
      await (0, _native.addToken)(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
      return {
        tokenId,
        tokenValidityStart,
        tokenValidityEnd
      };
    } catch (err) {
      if (err instanceof _fetcher.RequestError) {
        const {
          response
        } = err;
        console.error(response.body);
      } else {
        console.error(err);
      }

      throw err;
    }
  };
}

function createRenewToken(fetcher, hosts) {
  const attestActivateAdd = createAttestActivateAdd(fetcher, hosts);

  const renewTokenRequest = async (tokenId, body) => {
    const url = `${hosts.pto}/tokens/${tokenId}`;
    const response = await fetcher({
      url,
      body,
      method: 'POST'
    });
    return response.body;
  };

  return async token => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = await renewTokenRequest(token.tokenId, {
      requireAttestation
    });
    return attestActivateAdd(tokenId, nonce, attestationEncryptionPublicKey);
  };
}

function createInitToken(fetcher, hosts) {
  const attestActivateAdd = createAttestActivateAdd(fetcher, hosts);

  const initTokenRequest = async (body) => {
    const url = `${hosts.pto}/tokens`;
    const response = await fetcher({
      url,
      body,
      method: 'POST'
    });
    return response.body;
  };

  return async () => {
    const {
      tokenId,
      nonce,
      attestationEncryptionPublicKey
    } = await initTokenRequest({
      requireAttestation
    });
    return attestActivateAdd(tokenId, nonce, attestationEncryptionPublicKey);
  };
}
//# sourceMappingURL=index.js.map