import type { Fetch, Hosts } from '../config';
import type {
  ActivateTokenRequest,
  ActivateTokenResponse,
  InitializeTokenRequest,
  InitializeTokenResponse,
  ListTokensResponse,
  RenewTokenRequest,
  RenewTokenResponse,
} from './types';

export type AbtTokensService = {
  listTokens: () => Promise<ListTokensResponse>;
  initToken: (req: InitializeTokenRequest) => Promise<InitializeTokenResponse>;
  renewToken: (req: RenewTokenRequest) => Promise<RenewTokenResponse>;
  activateToken: (
    tokenId: string,
    req: ActivateTokenRequest
  ) => Promise<ActivateTokenResponse>;
};

export const createAbtTokensService = (
  fetcher: Fetch,
  hosts: Hosts
): AbtTokensService => {
  const listTokens = async () => {
    const url = `${hosts.pto}/tokens`;
    const response = await fetcher<ListTokensResponse>({
      url,
      method: 'GET',
    });
    return response.body;
  };

  const initToken = async (body: InitializeTokenRequest) => {
    const url = `${hosts.pto}/tokens`;
    const response = await fetcher<InitializeTokenResponse>({
      url,
      body,
      method: 'POST',
    });
    return response.body;
  };

  const renewToken = async (body: RenewTokenRequest) => {
    const url = `${hosts.pto}/tokens/renew`;
    const response = await fetcher<RenewTokenResponse>({
      url,
      body,
      method: 'POST',
    });
    return response.body;
  };

  const activateToken = async (tokenId: string, body: ActivateTokenRequest) => {
    const url = `${hosts.pto}/tokens/${tokenId}/activate`;
    const response = await fetcher<ActivateTokenResponse>({
      url,
      body,
      method: 'POST',
    });

    return response.body;
  };

  return {
    listTokens,
    initToken,
    renewToken,
    activateToken,
  };
};
