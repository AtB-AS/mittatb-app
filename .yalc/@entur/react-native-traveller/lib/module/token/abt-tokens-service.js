const SIGNED_TOKEN_HEADER_KEY = 'X-Signed-Token';
export const createAbtTokensService = (fetcher, hosts) => {
  const hostUrl = hosts.pto.replace(/\/$/, '');

  const listTokens = async () => {
    const url = `${hostUrl}/tokens`;
    const response = await fetcher({
      url,
      method: 'GET'
    });
    return response.body;
  };

  const getTokenCertificate = async signedToken => {
    const url = `${hostUrl}/tokens/certificate`;
    const response = await fetcher({
      url,
      headers: {
        [SIGNED_TOKEN_HEADER_KEY]: signedToken
      },
      method: 'GET'
    });
    return response.body;
  };

  const initToken = async body => {
    const url = `${hostUrl}/tokens`;
    const response = await fetcher({
      url,
      body,
      method: 'POST'
    });
    return response.body;
  };

  const renewToken = async signedToken => {
    const url = `${hostUrl}/tokens/renew`;
    const response = await fetcher({
      url,
      headers: {
        [SIGNED_TOKEN_HEADER_KEY]: signedToken
      },
      method: 'POST'
    });
    return response.body;
  };

  const activateToken = async (tokenId, body, signedToken) => {
    const url = `${hostUrl}/tokens/${tokenId}/activate`;
    const response = await fetcher({
      url,
      headers: signedToken ? {
        [SIGNED_TOKEN_HEADER_KEY]: signedToken
      } : {},
      body,
      method: 'POST'
    });
    return response.body;
  };

  const toggleToken = async (tokenId, body) => {
    const url = `${hostUrl}/tokens/${tokenId}/toggle`;
    const response = await fetcher({
      url,
      method: 'POST',
      body
    });
    return response.body;
  };

  const validateToken = async (tokenId, signedToken) => {
    const url = `${hostUrl}/tokens/${tokenId}/validate`;
    const response = await fetcher({
      url,
      headers: {
        [SIGNED_TOKEN_HEADER_KEY]: signedToken
      },
      method: 'GET'
    });
    return response.body;
  };

  return {
    listTokens,
    getTokenCertificate,
    initToken,
    renewToken,
    activateToken,
    toggleToken,
    validateToken
  };
};
//# sourceMappingURL=abt-tokens-service.js.map