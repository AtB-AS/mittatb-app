import type { AttestationData, LegacyAttestationData, PayloadAction, Token } from './types';
export declare type EnturTravellerType = {
    start(safetyNetApiKey?: string): Promise<AttestationData>;
    attest(accountId: string, tokenId: string, nonce: string): Promise<AttestationData>;
    attestLegacy(accountId: string, tokenId: string, nonce: string, serverPublicKey: string): Promise<LegacyAttestationData>;
    addToken(accountId: string, tokenId: string, certificate: string, tokenValidityStart: number, tokenValidityEnd: number, nonce?: string): Promise<void>;
    getToken(accountId: string): Promise<Token | undefined>;
    deleteToken(accountId: string): Promise<void>;
    getSecureToken(accountId: string, actions: PayloadAction[]): Promise<string>;
};
export declare const start: (safetyNetApiKey?: string | undefined) => Promise<AttestationData>, attest: (accountId: string, tokenId: string, nonce: string) => Promise<AttestationData>, attestLegacy: (accountId: string, tokenId: string, nonce: string, serverPublicKey: string) => Promise<LegacyAttestationData>, addToken: (accountId: string, tokenId: string, certificate: string, tokenValidityStart: number, tokenValidityEnd: number, nonce?: string | undefined) => Promise<void>, getToken: (accountId: string) => Promise<Token | undefined>, deleteToken: (accountId: string) => Promise<void>, getSecureToken: (accountId: string, actions: PayloadAction[]) => Promise<string>;
