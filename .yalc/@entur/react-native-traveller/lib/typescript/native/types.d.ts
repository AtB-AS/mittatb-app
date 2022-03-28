export declare type AttestationSupport = {
    result: 'SUPPORTED';
    attestationType: 'iOS_Device_Attestation' | 'iOS_Device_Check' | 'SafetyNet';
} | {
    result: 'NOT_SUPPORTED';
};
export declare type AttestationData = {
    attestationObject: string;
    keyId: string;
    deviceAttestationData: string;
    signaturePublicKey: string;
    encryptionPublicKey: string;
    signatureChain: string[];
    encryptionChain: string[];
};
export declare type ReattestationData = {
    attestationObject: string;
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
export declare enum PayloadAction {
    unspecified = 0,
    ticketTransfer = 1,
    addRemoveToken = 2,
    identification = 3,
    ticketInspection = 4,
    getFarecontracts = 5,
    travelcard = 6
}
