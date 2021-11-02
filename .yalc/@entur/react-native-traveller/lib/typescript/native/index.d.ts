import type { AttestationData, LegacyAttestationData, PayloadAction, Token } from './types';
export declare type EnturTravellerType = {
    attest(tokenId: string, nonce: string): Promise<AttestationData>;
    attestLegacy(tokenId: string, nonce: string, serverPublicKey: string): Promise<LegacyAttestationData>;
    addToken(tokenId: string, certificate: string, tokenValidityStart: number, tokenValidityEnd: number, nonce?: string): Promise<void>;
    getToken(): Promise<Token | undefined>;
    deleteToken(): Promise<void>;
    getSecureToken(actions: PayloadAction[]): Promise<string>;
};
export declare const attest: (tokenId: string, nonce: string) => Promise<AttestationData>, attestLegacy: (tokenId: string, nonce: string, serverPublicKey: string) => Promise<LegacyAttestationData>, addToken: (tokenId: string, certificate: string, tokenValidityStart: number, tokenValidityEnd: number, nonce?: string | undefined) => Promise<void>, getToken: () => Promise<Token | undefined>, deleteToken: () => Promise<void>, getSecureToken: (actions: PayloadAction[]) => Promise<string>;
