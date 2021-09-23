import { Platform } from 'react-native';
import { addToken, attest, attestLegacy } from '../native';
import { RequestError } from '../fetcher';
const requireAttestation = Platform.select({
  default: true,
  ios: false
});
var AttestationType;

(function (AttestationType) {
  AttestationType["SafetyNet"] = "SafetyNet";
  AttestationType["iOS_Device_Check"] = "iOS_Device_Check";
  AttestationType["iOS_Device_Attestation"] = "iOS_Device_Attestation";
})(AttestationType || (AttestationType = {}));

export function isTokenValid({
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
      const activateTokenRequestBody = await getActivateTokenRequestBody(initialTokenId, nonce, serverPublicKey);
      const {
        certificate,
        tokenId,
        tokenValidityEnd,
        tokenValidityStart
      } = await activateTokenRequest(initialTokenId, activateTokenRequestBody);
      if (tokenId !== initialTokenId) throw Error(`Activated token ${tokenId} does not match initial token ${initialTokenId}`);
      await addToken(tokenId, certificate, tokenValidityStart, tokenValidityEnd);
      return {
        tokenId,
        tokenValidityStart,
        tokenValidityEnd
      };
    } catch (err) {
      if (err instanceof RequestError) {
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

const getActivateTokenRequestBody = (initialTokenId, nonce, serverPublicKey) => {
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

export function createRenewToken(fetcher, hosts) {
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
export function createInitToken(fetcher, hosts) {
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