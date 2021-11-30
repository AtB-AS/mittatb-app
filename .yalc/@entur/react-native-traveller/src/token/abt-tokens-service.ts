import type { Fetch, Hosts } from '../config';
import type {
  ActivateTokenRequest,
  ActivateTokenResponse,
  GetTokenCertificateResponse,
  InitializeTokenRequest,
  InitializeTokenResponse,
  ListTokensResponse,
  RenewTokenResponse,
} from './types';

const SIGNED_TOKEN_HEADER_KEY = 'X-Signed-Token';

export type AbtTokensService = {
  listTokens: () => Promise<ListTokensResponse>;
  getTokenCertificate: (
    signedToken: string
  ) => Promise<GetTokenCertificateResponse>;
  initToken: (req: InitializeTokenRequest) => Promise<InitializeTokenResponse>;
  renewToken: (signedToken: string) => Promise<RenewTokenResponse>;
  activateToken: (
    tokenId: string,
    req: ActivateTokenRequest,
    signedToken?: string
  ) => Promise<ActivateTokenResponse>;
};

export const createAbtTokensService = (
  fetcher: Fetch,
  hosts: Hosts
): AbtTokensService => {
  const hostUrl = hosts.pto.replace(/\/$/, '');

  const listTokens = async () => {
    const url = `${hostUrl}/tokens`;
    const response = await fetcher<ListTokensResponse>({
      url,
      method: 'GET',
    });
    return response.body;
  };

  const getTokenCertificate = async (signedToken: string) => {
    const url = `${hostUrl}/tokens/certificate`;
    const response = await fetcher<GetTokenCertificateResponse>({
      url,
      headers: {
        [SIGNED_TOKEN_HEADER_KEY]: signedToken,
      },
      method: 'GET',
    });
    return response.body;
  };

  const initToken = async (body: InitializeTokenRequest) => {
    const url = `${hostUrl}/tokens`;
    const response = await fetcher<InitializeTokenResponse>({
      url,
      body,
      method: 'POST',
    });
    return response.body;
  };

  const renewToken = async (signedToken: string) => {
    const url = `${hostUrl}/tokens/renew`;
    const response = await fetcher<RenewTokenResponse>({
      url,
      headers: {
        [SIGNED_TOKEN_HEADER_KEY]: signedToken,
      },
      method: 'POST',
    });
    return response.body;
  };

  const activateToken = async (
    tokenId: string,
    body: ActivateTokenRequest,
    signedToken?: string
  ) => {
    const url = `${hostUrl}/tokens/${tokenId}/activate`;
    const response = await fetcher<ActivateTokenResponse>({
      url,
      headers: signedToken
        ? {
            [SIGNED_TOKEN_HEADER_KEY]: signedToken,
          }
        : {},
      body,
      method: 'POST',
    });

    return response.body;
  };

  return {
    listTokens,
    getTokenCertificate,
    initToken,
    renewToken,
    activateToken,
  };
};
