function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import base64 from 'base-64';
import utf8 from 'utf8';
import { logger } from './logger';
export class RequestError extends Error {
  constructor(response) {
    const message = `${response.status}`; //: ${response.statusText}`;

    super(message); // Maintains proper stack trace for where our error was thrown (only available on V8)

    _defineProperty(this, "response", void 0);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }

    this.name = 'RequestError';
    this.response = response;
  }

}

function createInternalFetcher(config) {
  return async request => {
    const response = await config.fetch({ ...request,
      headers: { ...(config === null || config === void 0 ? void 0 : config.extraHeaders),
        ...(request === null || request === void 0 ? void 0 : request.headers)
      }
    });

    if (!isOk(response)) {
      throw new RequestError(response);
    }

    return response;
  };
}

export function createFetcher(config, reattest) {
  const fetcher = createInternalFetcher(config);

  const handleRequest = async (request, allowRetry = true) => {
    try {
      return await fetcher(request);
    } catch (error) {
      var _error$response;

      const errorResponseData = error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data;

      if (isReattestationError(errorResponseData)) {
        var _request$headers;

        const {
          token_id,
          nonce
        } = errorResponseData.metadata;
        logger.info('mobiletoken_reattestation_required', undefined, {
          tokenId: token_id
        });
        const reattestBody = await reattest(token_id, nonce);
        const jsonBody = JSON.stringify(reattestBody);
        const utf8value = utf8.encode(jsonBody);
        const headerValue = base64.encode(utf8value);
        const headers = (_request$headers = request.headers) !== null && _request$headers !== void 0 ? _request$headers : {};
        headers['X-Attestation-Data'] = headerValue;
        request.headers = headers;
        return handleRequest(request, true);
      }

      logger.error(undefined, error, undefined);

      if (error instanceof RequestError) {
        if (allowRetry) {
          return handleRequest(request, false);
        }
      }

      throw error;
    }
  };

  return req => handleRequest(req, true);
}

function isOk(response) {
  return response.status > 199 && response.status < 300;
}

const isReattestationError = data => {
  return (data === null || data === void 0 ? void 0 : data.code) === 'REATTESTATION_REQUIRED';
};
//# sourceMappingURL=fetcher.js.map