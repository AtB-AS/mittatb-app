import type { Token } from '@entur/react-native-traveller';

export type InitializeTokenRequest = {
  requireAttestation: boolean;
  deviceName: string;
  keyValues?: Map<string, string>;
};

export type InitializeTokenResponse = {
  attestationEncryptionPublicKey: string;
  tokenId: string;
  /** base64 encoded nonce */
  nonce: string;
  nonceValidityEnd: number;
};

export type ListTokensResponse = {
  id: string;
  // deviceName: string;
  // deviceId: string;
}[];

export type GetTokenCertificateResponse = ActivateTokenResponse;

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

const errorTypes = ['None', 'Severe', 'Unknown', 'Network'] as const;
export type ErrorType = typeof errorTypes[number];

export type TokenError = {
  type: ErrorType;
  message: string;
  err?: any;
};

export type TokenStatus = {
  state: TokenState;
  error?: TokenError;
  visualState: VisualState;
};

const tokenStates = [
  'Starting',
  'Loading',
  'Valid',
  'GettingTokenCertificate',
  'Validating',
  'DeleteLocal',
  'InitiateNew',
  'InitiateRenewal',
  'AttestNew',
  'AttestRenewal',
  'ActivateNew',
  'ActivateRenewal',
  'AddToken',
] as const;
export type TokenState = typeof tokenStates[number];

export type StoredState = {
  deviceId?: string;
  error?: TokenError;
} & (
  | {
      state:
        | 'Starting'
        | 'Loading'
        | 'InitiateNew'
        | 'DeleteLocal'
        | 'InitiateRenewal'
        | 'Valid'
        | 'GettingTokenCertificate';
    }
  | {
      state: 'Validating';
      token: Token;
    }
  | {
      state: 'AttestNew' | 'AttestRenewal';
      initiatedData: InitializeTokenResponse;
    }
  | {
      state: 'ActivateNew' | 'ActivateRenewal';
      attestationData: ActivateTokenRequest;
      tokenId: string;
    }
  | {
      state: 'AddToken';
      activatedData: ActivateTokenResponse;
    }
);

export type VisualState = 'Token' | 'Loading' | 'Error';
