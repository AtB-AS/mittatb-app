import type { ActivateTokenRequest } from './types';
export declare const getActivateTokenRequestBody: (initialTokenId: string, nonce: string, serverPublicKey: string) => Promise<ActivateTokenRequest>;
