export declare type AttestationData = {
    attestation: string;
    signaturePublicKey: string;
    encryptionPublicKey: string;
};
export declare type LegacyAttestationData = {
    attestationEncryptionKey: string;
} & AttestationData;
export declare type Token = {
    tokenId: string;
    tokenValidityStart: number;
    tokenValidityEnd: number;
};
