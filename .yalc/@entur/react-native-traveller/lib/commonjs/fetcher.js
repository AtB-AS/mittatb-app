"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFetcher = createFetcher;
exports.RequestError = void 0;

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

function createFetcher(config) {
  const fetcher = createInternalFetcher(config);

  const handleRequest = async (request, allowRetry = true) => {
    try {
      return await fetcher(request);
    } catch (error) {
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
//# sourceMappingURL=fetcher.js.map