import type { ApiRequest, ApiResponse, Config, Fetch } from './config';

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

  const handleRequest = async <T>(
    request: ApiRequest,
    allowRetry = true
  ): Promise<ApiResponse<T>> => {
    try {
      return await fetcher<T>(request);
    } catch (error) {
      if (error instanceof RequestError) {
        if (allowRetry) {
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
