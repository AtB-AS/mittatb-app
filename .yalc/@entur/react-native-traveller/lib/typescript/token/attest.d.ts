import type { ActivateTokenRequest } from './types';
export declare const getActivateTokenRequestBody: (accountId: string, initialTokenId: string, nonce: string, serverPublicKey: string) => Promise<ActivateTokenRequest>;
