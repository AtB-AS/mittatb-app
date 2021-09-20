function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { getToken } from './native';
import { createRenewToken } from './token';
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

async function tokenNeedsRenewal(response) {
  if (response.status !== 401) return false;
  const contentType = response.headers['content-type'];
  if (contentType !== 'application/json') return false;

  if (isApiErrorBody(response.body)) {
    const {
      errorCode
    } = await response.body;
    return errorCode === 'TOKEN_EXPIRED';
  }

  return false;
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

export function createFetcher(config) {
  const fetcher = createInternalFetcher(config);
  let renewTokenLock;
  const renewToken = createRenewToken(fetcher, config.hosts);

  const handleTokenRenewal = () => {
    const handle = async () => {
      const token = await getToken();
      if (!token) return;
      await renewToken(token);
    };

    renewTokenLock = handle().finally(() => {
      renewTokenLock = undefined;
    });
    return renewTokenLock;
  };

  const handleRequest = async (request, allowRetry = true) => {
    if (renewTokenLock) {
      await renewTokenLock;
      return handleRequest(request, false);
    }

    try {
      return await fetcher(request);
    } catch (error) {
      if (error instanceof RequestError) {
        const {
          response
        } = error;

        if (allowRetry && (await tokenNeedsRenewal(response))) {
          await handleTokenRenewal();
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

function isApiErrorBody(body) {
  return 'error_code' in body;
}
//# sourceMappingURL=fetcher.js.map