export type AttestationData = {
  attestation: string;
  signaturePublicKey: string;
  encryptionPublicKey: string;
};

export type LegacyAttestationData = {
  attestationEncryptionKey: string;
} & AttestationData;

export type Token = {
  tokenId: string;
  tokenValidityStart: number;
  tokenValidityEnd: number;
};
