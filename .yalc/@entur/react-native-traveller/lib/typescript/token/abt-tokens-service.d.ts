import type { Fetch, Hosts } from '../config';
import type { ActivateTokenRequest, ActivateTokenResponse, InitializeTokenRequest, InitializeTokenResponse, ListTokensResponse, RenewTokenRequest, RenewTokenResponse } from './types';
export declare type AbtTokensService = {
    listTokens: () => Promise<ListTokensResponse>;
    initToken: (req: InitializeTokenRequest) => Promise<InitializeTokenResponse>;
    renewToken: (req: RenewTokenRequest) => Promise<RenewTokenResponse>;
    activateToken: (tokenId: string, req: ActivateTokenRequest) => Promise<ActivateTokenResponse>;
};
export declare const createAbtTokensService: (fetcher: Fetch, hosts: Hosts) => AbtTokensService;
