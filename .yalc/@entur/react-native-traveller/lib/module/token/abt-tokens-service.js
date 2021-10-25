const SIGNED_TOKEN_HEADER_KEY = 'X-Signed-Token';
export const createAbtTokensService = (fetcher, hosts) => {
  const listTokens = async () => {
    const url = `${hosts.pto}/tokens`;
    const response = await fetcher({
      url,
      method: 'GET'
    });
    return response.body;
  };

  const getTokenCertificate = async signedToken => {
    const url = `${hosts.pto}/tokens/certificate`;
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
    const url = `${hosts.pto}/tokens`;
    const response = await fetcher({
      url,
      body,
      method: 'POST'
    });
    return response.body;
  };

  const renewToken = async signedToken => {
    const url = `${hosts.pto}/tokens/renew`;
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
    const url = `${hosts.pto}/tokens/${tokenId}/activate`;
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

  return {
    listTokens,
    getTokenCertificate,
    initToken,
    renewToken,
    activateToken
  };
};
//# sourceMappingURL=abt-tokens-service.js.map