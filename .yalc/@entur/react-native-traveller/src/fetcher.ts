import type {
  Fetch,
  Config,
  ApiResponse,
  ApiRequest,
  ApiErrorBody,
} from './config';
import { getToken } from './native';
import { createRenewToken } from './token';

export class RequestError extends Error {
  response: ApiResponse;

  constructor(response: ApiResponse) {
    const message = `${response.status}`; //: ${response.statusText}`;
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }

    this.name = 'RequestError';
    this.response = response;
  }
}

async function tokenNeedsRenewal<T>(
  response: ApiResponse<T>
): Promise<boolean> {
  if (response.status !== 401) return false;
  const contentType = response.headers['content-type'];
  if (contentType !== 'application/json') return false;

  if (isApiErrorBody(response.body)) {
    const { errorCode } = await response.body;

    return errorCode === 'TOKEN_EXPIRED';
  }

  return false;
}

function createInternalFetcher(config: Config): Fetch {
  return async <T>(request: ApiRequest) => {
    const response = await config.fetch<T>({
      ...request,
      headers: {
        ...config?.extraHeaders,
        ...request?.headers,
      },
    });

    if (!isOk(response)) {
      throw new RequestError(response);
    }

    return response;
  };
}

export function createFetcher(config: Config): Fetch {
  const fetcher = createInternalFetcher(config);

  let renewTokenLock: Promise<void> | undefined;
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

  const handleRequest = async <T>(
    request: ApiRequest,
    allowRetry = true
  ): Promise<ApiResponse<T>> => {
    if (renewTokenLock) {
      await renewTokenLock;
      return handleRequest(request, false);
    }

    try {
      return await fetcher<T>(request);
    } catch (error) {
      if (error instanceof RequestError) {
        const { response } = error;
        if (allowRetry && (await tokenNeedsRenewal(response))) {
          await handleTokenRenewal();
          return handleRequest(request, false);
        }
      }

      throw error;
    }
  };

  return (req: ApiRequest) => handleRequest(req, true);
}

function isOk(response: ApiResponse) {
  return response.status > 199 && response.status < 300;
}

function isApiErrorBody(body: any): body is ApiErrorBody {
  return 'error_code' in body;
}
