import type { ApiRequest, ApiResponse, Config, Fetch } from './config';
import type { ActivateTokenRequest } from './token/types';
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
  errorReason: 'REATTESTATION_REQUIRED';
  tokenId: string;
  nonce: string;
  attestationEncryptionPublicKey: string;
};

export class ReattestationError extends Error {
  reattestationData: ReattestationData;

  constructor(data: ReattestationData) {
    const name = 'ReattestationError';
    super(name);

    this.name = name;
    this.reattestationData = data;
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

    if (isErrorResponse(response)) {
      if (response.body.code === 'REATTESTATION_REQUIRED') {
        throw new ReattestationError(
          response.body.metadata as ReattestationData
        );
      }
    }

    if (!isOk(response)) {
      throw new RequestError(response);
    }

    return response;
  };
}

type ReattestFunction = (
  tokenId: string,
  nonce: string,
  attestationEncryptionPublicKey: string
) => Promise<ActivateTokenRequest>;

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
      if (error instanceof ReattestationError) {
        const {
          tokenId,
          nonce,
          attestationEncryptionPublicKey,
        } = error.reattestationData;
        const reattestBody = await reattest(
          tokenId,
          nonce,
          attestationEncryptionPublicKey
        );

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

function isErrorResponse(
  response: ApiResponse
): response is ApiResponse<ErrorResponse> {
  return 'code' in response.body;
}
