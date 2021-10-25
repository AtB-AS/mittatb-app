import type { Fetch, Hosts } from '../config';
import type { ActivateTokenRequest, ActivateTokenResponse, GetTokenCertificateResponse, InitializeTokenRequest, InitializeTokenResponse, ListTokensResponse, RenewTokenResponse } from './types';
export declare type AbtTokensService = {
    listTokens: () => Promise<ListTokensResponse>;
    getTokenCertificate: (signedToken: string) => Promise<GetTokenCertificateResponse>;
    initToken: (req: InitializeTokenRequest) => Promise<InitializeTokenResponse>;
    renewToken: (signedToken: string) => Promise<RenewTokenResponse>;
    activateToken: (tokenId: string, req: ActivateTokenRequest, signedToken?: string) => Promise<ActivateTokenResponse>;
};
export declare const createAbtTokensService: (fetcher: Fetch, hosts: Hosts) => AbtTokensService;
