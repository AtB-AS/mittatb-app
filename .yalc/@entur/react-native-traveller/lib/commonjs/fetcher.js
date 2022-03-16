"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFetcher = createFetcher;
exports.ReattestationError = exports.RequestError = void 0;

var _base = _interopRequireDefault(require("base-64"));

var _utf = _interopRequireDefault(require("utf8"));

var _logger = require("./logger");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RequestError extends Error {
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

exports.RequestError = RequestError;

class ReattestationError extends Error {
  constructor(data) {
    const name = 'ReattestationError';
    super(name);

    _defineProperty(this, "reattestationData", void 0);

    this.name = name;
    this.reattestationData = data;
  }

}

exports.ReattestationError = ReattestationError;

function createInternalFetcher(config) {
  return async request => {
    const response = await config.fetch({ ...request,
      headers: { ...(config === null || config === void 0 ? void 0 : config.extraHeaders),
        ...(request === null || request === void 0 ? void 0 : request.headers)
      }
    });

    if (isErrorResponse(response)) {
      if (response.body.code === 'REATTESTATION_REQUIRED') {
        throw new ReattestationError(response.body.metadata);
      }
    }

    if (!isOk(response)) {
      throw new RequestError(response);
    }

    return response;
  };
}

function createFetcher(config, reattest) {
  const fetcher = createInternalFetcher(config);

  const handleRequest = async (request, allowRetry = true) => {
    try {
      return await fetcher(request);
    } catch (error) {
      if (error instanceof ReattestationError) {
        var _request$headers;

        const {
          tokenId,
          nonce,
          attestationEncryptionPublicKey
        } = error.reattestationData;
        const reattestBody = await reattest(tokenId, nonce, attestationEncryptionPublicKey);
        const jsonBody = JSON.stringify(reattestBody);

        const utf8value = _utf.default.encode(jsonBody);

        const headerValue = _base.default.encode(utf8value);

        const headers = (_request$headers = request.headers) !== null && _request$headers !== void 0 ? _request$headers : {};
        headers['X-Attestation-Data'] = headerValue;
        request.headers = headers;
        return handleRequest(request, true);
      }

      _logger.logger.error(undefined, error, undefined);

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

function isErrorResponse(response) {
  return 'code' in response.body;
}
//# sourceMappingURL=fetcher.js.map