"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAbtTokensService = void 0;

const createAbtTokensService = (fetcher, hosts) => {
  const listTokens = async () => {
    const url = `${hosts.pto}/tokens`;
    const response = await fetcher({
      url,
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

  const renewToken = async body => {
    const url = `${hosts.pto}/tokens/renew`;
    const response = await fetcher({
      url,
      body,
      method: 'POST'
    });
    return response.body;
  };

  const activateToken = async (tokenId, body) => {
    const url = `${hosts.pto}/tokens/${tokenId}/activate`;
    const response = await fetcher({
      url,
      body,
      method: 'POST'
    });
    return response.body;
  };

  return {
    listTokens,
    initToken,
    renewToken,
    activateToken
  };
};

exports.createAbtTokensService = createAbtTokensService;
//# sourceMappingURL=abt-tokens-service.js.map