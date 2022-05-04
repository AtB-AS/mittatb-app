import type { ApiResponse, Config, Fetch } from './config';
import type { Attestation } from './token/types';
export declare class RequestError extends Error {
    response: ApiResponse;
    constructor(response: ApiResponse);
}
declare type ReattestFunction = (tokenId: string, nonce: string) => Promise<Attestation>;
export declare function createFetcher(config: Config, reattest: ReattestFunction): Fetch;
export {};
