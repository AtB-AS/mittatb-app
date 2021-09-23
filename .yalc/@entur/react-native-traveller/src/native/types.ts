export type AttestationData = {
  attestationObject: string;
  keyId: string;
  deviceAttestationData: string;
  signaturePublicKey: string;
  encryptionPublicKey: string;
};

export type LegacyAttestationData = {
  attestation: string;
  attestationEncryptionKey: string;
  signaturePublicKey: string;
  encryptionPublicKey: string;
};

export type Token = {
  tokenId: string;
  tokenValidityStart: number;
  tokenValidityEnd: number;
};
