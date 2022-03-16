import type { ApiResponse, Config, Fetch } from './config';
import type { ActivateTokenRequest } from './token/types';
export declare class RequestError extends Error {
    response: ApiResponse;
    constructor(response: ApiResponse);
}
declare type ReattestationData = {
    errorReason: 'REATTESTATION_REQUIRED';
    tokenId: string;
    nonce: string;
    attestationEncryptionPublicKey: string;
};
export declare class ReattestationError extends Error {
    reattestationData: ReattestationData;
    constructor(data: ReattestationData);
}
declare type ReattestFunction = (tokenId: string, nonce: string, attestationEncryptionPublicKey: string) => Promise<ActivateTokenRequest>;
export declare function createFetcher(config: Config, reattest: ReattestFunction): Fetch;
export {};
