import type { ApiRequest, ApiResponse, Fetch } from '../config/types';

const internalFetcher: Fetch = async <T>(
  request: ApiRequest
): Promise<ApiResponse<T>> => {
  const { url, method, headers } = request;
  const response = await fetch(url, {
    method,
    headers,
    body: request.body ? JSON.stringify(request.body) : undefined,
  });

  const { status } = response;

  const responseHeaders: Record<string, string> = {};
  for (let header of response.headers as any) {
    responseHeaders[header[0]] = header[1];
  }

  const data = await response.json();

  return {
    body: data,
    status,
    headers: responseHeaders,
  };
};

export default internalFetcher;
