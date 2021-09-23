export declare type AttestationData = {
    attestationObject: string;
    keyId: string;
    deviceAttestationData: string;
    signaturePublicKey: string;
    encryptionPublicKey: string;
};
export declare type LegacyAttestationData = {
    attestation: string;
    attestationEncryptionKey: string;
    signaturePublicKey: string;
    encryptionPublicKey: string;
};
export declare type Token = {
    tokenId: string;
    tokenValidityStart: number;
    tokenValidityEnd: number;
};
