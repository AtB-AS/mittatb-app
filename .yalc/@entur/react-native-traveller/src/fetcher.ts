import type { ApiRequest, ApiResponse, Config, Fetch } from './config';
import type { Attestation } from './token/types';
import base64 from 'base-64';
import utf8 from 'utf8';
import { logger } from './logger';

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

type ErrorResponse = {
  code: string;
  message: string;
  metadata: any;
};

type ReattestationData = {
  token_id: string;
  nonce: string;
  attestation_encryption_public_key: string;
};

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

type ReattestFunction = (
  tokenId: string,
  nonce: string
) => Promise<Attestation>;

export function createFetcher(
  config: Config,
  reattest: ReattestFunction
): Fetch {
  const fetcher = createInternalFetcher(config);

  const handleRequest = async <T>(
    request: ApiRequest,
    allowRetry = true
  ): Promise<ApiResponse<T>> => {
    try {
      return await fetcher<T>(request);
    } catch (error: any) {
      const errorResponseData = error?.response?.data;
      if (isReattestationError(errorResponseData)) {
        const {
          token_id,
          nonce,
        }: ReattestationData = errorResponseData.metadata;
        logger.info('mobiletoken_reattestation_required', undefined, {
          tokenId: token_id,
        });
        const reattestBody = await reattest(token_id, nonce);

        const jsonBody = JSON.stringify(reattestBody);
        const utf8value = utf8.encode(jsonBody);
        const headerValue = base64.encode(utf8value);

        const headers: Record<string, string> = request.headers ?? {};

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

  return (req: ApiRequest) => handleRequest(req, true);
}

function isOk(response: ApiResponse) {
  return response.status > 199 && response.status < 300;
}

const isReattestationError = (data: any): data is ErrorResponse => {
  return data?.code === 'REATTESTATION_REQUIRED';
};
