import { InitialConfig } from './config';
export type { Token } from './native/types';
export { isTokenValid } from './token';
export { RequestError } from './fetcher';
export type { Fetch, ApiResponse, ApiRequest } from './config';
export default function createClient(initialConfig?: InitialConfig): {
    initToken: () => Promise<import("./native/types").Token>;
    getToken: () => Promise<import("./native/types").Token | undefined>;
    deleteToken: () => Promise<void>;
    generateQrCode: () => Promise<string>;
};
