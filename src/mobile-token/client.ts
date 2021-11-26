import {createClient} from '@atb/api/client';
import createMobileTokenClient, {
  ApiRequest,
  ApiResponse,
  Fetch,
} from '@entur/react-native-traveller';
export type {Token} from '@entur/react-native-traveller';
import {API_BASE_URL} from '@env';
import {AxiosRequestConfig, Method} from 'axios';
import {TokenStatus} from '@entur/react-native-traveller/lib/typescript/token/types';
import {SAFETY_NET_API_KEY} from '@env';

const client = createClient(undefined);

const fetcher: Fetch = async <T>(
  request: ApiRequest,
): Promise<ApiResponse<T>> => {
  const axiosRequest = mapRequest(request);

  const response = await client.request<T>(axiosRequest);

  return {
    body: response.data,
    headers: response.headers,
    status: response.status,
  };
};

const baseConfig: AxiosRequestConfig = {authWithIdToken: true};

function mapRequest(request: ApiRequest): AxiosRequestConfig {
  return {
    url: request.url,
    method: request.method as Method,
    headers: request.headers,
    data: request.body,
    ...baseConfig,
  };
}

export const setupMobileTokenClient = (setStatus: (s?: TokenStatus) => void) =>
  createMobileTokenClient(setStatus, {
    hosts: {pto: API_BASE_URL},
    fetch: fetcher,
    safetyNetApiKey: SAFETY_NET_API_KEY,
  });
