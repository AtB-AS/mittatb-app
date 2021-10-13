export declare type InitializeTokenRequest = {
    requireAttestation: boolean;
};
export declare type InitializeTokenResponse = {
    attestationEncryptionPublicKey: string;
    tokenId: string;
    /** base64 encoded nonce */
    nonce: string;
    nonceValidityEnd: number;
};
export declare type ListTokensResponse = {
    id: string;
}[];
export declare type RenewTokenRequest = {
    existingToken?: string;
};
export declare type RenewTokenResponse = {
    attestationEncryptionPublicKey: string;
    tokenId: string;
    /** base64 encoded nonce */
    nonce: string;
    nonceValidityEnd: number;
};
export declare type AttestationIOSDeviceCheck = {
    attestationType: 'iOS_Device_Check';
    /** base64 encoded data from iOS DeviceCheck API */
    encryptedIosDeviceCheckData: string;
    /** base64 encoded RSA encrypted AES key, for attestation type 'iOS_Device_Check'. Encrypted with the attestationEncryptionPublicKey from InitializeTokenResponse. */
    attestationEncryptionEncryptedKey: string;
};
export declare type ActivateTokenRequest = {
    /** base64 encoded token public key */
    signaturePublicKey?: string;
    encryptionPublicKey?: string;
    existingToken?: string;
    attestation: {
        attestationType: 'iOS_Device_Check';
        /** base64 encoded data from iOS DeviceCheck API */
        encryptedIosDeviceCheckData: string;
        /** base64 encoded RSA encrypted AES key, for attestation type 'iOS_Device_Check'. Encrypted with the attestationEncryptionPublicKey from InitializeTokenResponse. */
        attestationEncryptionEncryptedKey: string;
    } | {
        attestationType: 'SafetyNet';
        /** SafetyNet JWS from client */
        safetyNetJws: string;
        /** base64 encoded attestations for public key, for attestation type 'SafetyNet'. */
        signaturePublicKeyAttestation: string[];
        /** base64 encoded attestations for encryption public key, for attestation type 'SafetyNet'. */
        encryptionPublicKeyAttestation: string[];
    } | {
        attestationType: 'iOS_Device_Attestation';
        /** base64 encoded object from API, should be created with serialized DeviceAttestationData as a challeng */
        attestationObject: string;
        /** base64 encoded key id, from generated iOS app attest data. */
        keyId: string;
        /** base64 encoded serialized DeviceAttestationData protobuf */
        deviceAttestationData: string;
    };
};
export declare type ActivateTokenResponse = {
    certificate: string;
    tokenId: string;
    tokenValidityStart: number;
    tokenValidityEnd: number;
};
declare const errorTypes: readonly ["None", "Unknown", "Network"];
export declare type ErrorType = typeof errorTypes[number];
export declare type TokenError = {
    type: ErrorType;
    message: string;
    err: any;
};
export declare type TokenStatus = {
    state: TokenState;
    error?: TokenError;
};
declare const tokenStates: readonly ["Loading", "Valid", "Validating", "Initiating", "Renewing"];
export declare type TokenState = typeof tokenStates[number];
export {};
