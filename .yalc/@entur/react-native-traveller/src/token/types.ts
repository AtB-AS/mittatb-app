export type InitializeTokenRequest = {
  requireAttestation: boolean;
  deviceName: string;
  keyValues?: {
    [key: string]: string;
  };
};

export type InitializeTokenResponse = {
  attestationEncryptionPublicKey: string;
  tokenId: string;
  /** base64 encoded nonce */
  nonce: string;
  nonceValidityEnd: number;
};

export type TokenLifecycleState =
  | 'TOKEN_LIFECYCLE_STATE_UNSPECIFIED'
  | 'TOKEN_LIFECYCLE_STATE_NOT_ACTIVATED'
  | 'TOKEN_LIFECYCLE_STATE_ACTIVATED'
  | 'TOKEN_LIFECYCLE_STATE_CANCELLED'
  | 'TOKEN_LIFECYCLE_STATE_REMOVED';

export type TokenType =
  | 'TOKEN_TYPE_UNSPECIFIED'
  | 'TOKEN_TYPE_QR_SMARTPHONE'
  | 'TOKEN_TYPE_QR_PAPER'
  | 'TOKEN_TYPE_TRAVELCARD'
  | 'TOKEN_TYPE_REFERENCE_CODE'
  | 'TOKEN_TYPE_PLAIN_UNSIGNED'
  | 'TOKEN_TYPE_EXTERNAL';

export type TokenAction =
  | 'TOKEN_ACTION_UNSPECIFIED'
  | 'TOKEN_ACTION_TICKET_TRANSFER'
  | 'TOKEN_ACTION_ADD_REMOVE_TOKEN'
  | 'TOKEN_ACTION_IDENTIFICATION'
  | 'TOKEN_ACTION_TICKET_INSPECTION'
  | 'TOKEN_ACTION_GET_FARECONTRACTS'
  | 'TOKEN_ACTION_TRAVELCARD'
  | 'TOKEN_ACTION_CONSUME_ACCESS_RIGHTS';

export type StoredToken = {
  id: string;
  expires: number;
  state: TokenLifecycleState;
  type: TokenType;
  allowedActions: TokenAction[];
  deviceName: string;
  keyValues?: {
    [key: string]: string;
  };
};

export type ListTokensResponse = StoredToken[];

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

export type ToggleTokenRequest = {
  overrideExisting: boolean;
};

export type ToggleTokenResponse = {
  tokens: StoredToken[];
};

export type ValidateTokenResponse = {
  state: 'Valid' | 'NotFound' | 'NeedsRenewal' | 'NeedsReplacement';
};

const errorTypes = ['None', 'Severe', 'Unknown', 'Network'] as const;
export type ErrorType = typeof errorTypes[number];

export type TokenError = {
  missingNetConnection: boolean;
  message: string;
  err?: any;
};

export type TokenStatus = {
  tokenId?: string;
  state: TokenState;
  error?: TokenError;
  visualState: VisualState;
};

const tokenStates = [
  'Starting',
  'NotSupported',
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
  'VerifyInspectionAction',
] as const;
export type TokenState = typeof tokenStates[number];

export type StoredState = {
  accountId: string;
  error?: TokenError;
} & (
  | {
      state:
        | 'Starting'
        | 'Loading'
        | 'InitiateNew'
        | 'DeleteLocal'
        | 'NotSupported';
    }
  | {
      state:
        | 'GettingTokenCertificate'
        | 'InitiateRenewal'
        | 'VerifyInspectionAction';
      tokenId: string;
    }
  | {
      state: 'Valid';
      tokenId: string;
    }
  | {
      state: 'Validating';
      tokenId: string;
    }
  | {
      state: 'AttestNew';
      initiatedData: InitializeTokenResponse;
    }
  | {
      state: 'AttestRenewal';
      initiatedData: InitializeTokenResponse;
      oldTokenId: string;
    }
  | {
      state: 'ActivateNew';
      attestationData: ActivateTokenRequest;
      tokenId: string;
    }
  | {
      state: 'ActivateRenewal';
      attestationData: ActivateTokenRequest;
      tokenId: string;
      oldTokenId: string;
    }
  | {
      state: 'AddToken';
      tokenId: string;
      activatedData: ActivateTokenResponse;
    }
);

export type VisualState =
  | 'Token'
  | 'NotInspectable'
  | 'Loading'
  | 'Error'
  | 'MissingNetConnection';
