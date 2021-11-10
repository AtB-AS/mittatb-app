import { InitialConfig } from './config';
import type { TokenStatus } from './token/types';
export type { Token } from './native/types';
export { RequestError } from './fetcher';
export type { Fetch, ApiResponse, ApiRequest } from './config';
export declare type ClientState = {
    accountId?: string;
};
export declare type ClientStateRetriever = () => ClientState;
export default function createClient(setStatus: (status?: TokenStatus) => void, initialConfig: InitialConfig): {
    setAccount(accountId: string | undefined): void;
    retry: (forceRestart: boolean) => void;
    generateQrCode: () => Promise<string>;
};
