import type { ActivateTokenRequest, Attestation } from './types';
export declare const getActivateTokenRequestBody: (accountId: string, initialTokenId: string, nonce: string, serverPublicKey: string) => Promise<ActivateTokenRequest>;
export declare const getReattestation: (accountId: string, tokenId: string, nonce: string) => Promise<Attestation>;
