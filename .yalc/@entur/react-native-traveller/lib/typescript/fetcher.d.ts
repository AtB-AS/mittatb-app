import type { Fetch, Config, ApiResponse } from './config';
export declare class RequestError extends Error {
    response: ApiResponse;
    constructor(response: ApiResponse);
}
export declare function createFetcher(config: Config): Fetch;
