export type InitializeTokenRequest = {
  requireAttestation: boolean;
};

export type InitializeTokenResponse = {
  attestationEncryptionPublicKey: string;
  tokenId: string;
  /** base64 encoded nonce */
  nonce: string;
  nonceValidityEnd: number;
};

export type ListTokensResponse = { id: string }[];

export type RenewTokenRequest = {
  existingToken?: string;
};

export type RenewTokenResponse = {
  attestationEncryptionPublicKey: string;
  tokenId: string;
  /** base64 encoded nonce */
  nonce: string;
  nonceValidityEnd: number;
};

export type AttestationIOSDeviceCheck = {
  attestationType: 'iOS_Device_Check';
  /** base64 encoded data from iOS DeviceCheck API */
  encryptedIosDeviceCheckData: string;
  /** base64 encoded RSA encrypted AES key, for attestation type 'iOS_Device_Check'. Encrypted with the attestationEncryptionPublicKey from InitializeTokenResponse. */
  attestationEncryptionEncryptedKey: string;
};

export type ActivateTokenRequest = {
  /** base64 encoded token public key */
  signaturePublicKey?: string;
  encryptionPublicKey?: string;
  existingToken?: string;
  attestation:
    | {
        attestationType: 'iOS_Device_Check';
        /** base64 encoded data from iOS DeviceCheck API */
        encryptedIosDeviceCheckData: string;
        /** base64 encoded RSA encrypted AES key, for attestation type 'iOS_Device_Check'. Encrypted with the attestationEncryptionPublicKey from InitializeTokenResponse. */
        attestationEncryptionEncryptedKey: string;
      }
    | {
        attestationType: 'SafetyNet';
        /** SafetyNet JWS from client */
        safetyNetJws: string;
        /** base64 encoded attestations for public key, for attestation type 'SafetyNet'. */
        signaturePublicKeyAttestation: string[];
        /** base64 encoded attestations for encryption public key, for attestation type 'SafetyNet'. */
        encryptionPublicKeyAttestation: string[];
      }
    | {
        attestationType: 'iOS_Device_Attestation';
        /** base64 encoded object from API, should be created with serialized DeviceAttestationData as a challeng */
        attestationObject: string;
        /** base64 encoded key id, from generated iOS app attest data. */
        keyId: string;
        /** base64 encoded serialized DeviceAttestationData protobuf */
        deviceAttestationData: string;
      };
};

export type ActivateTokenResponse = {
  // base64 encoded certificate
  certificate: string;
  tokenId: string;
  tokenValidityStart: number;
  tokenValidityEnd: number;
};

const errorTypes = ['None', 'Unknown', 'Network'] as const;
export type ErrorType = typeof errorTypes[number];

export type TokenError = {
  type: ErrorType;
  message: string;
  err: any;
};

export type TokenStatus = {
  state: TokenState;
  error?: TokenError;
};

const tokenStates = [
  'Loading',
  'Valid',
  'Validating',
  'Initiating',
  'Renewing',
] as const;
export type TokenState = typeof tokenStates[number];
