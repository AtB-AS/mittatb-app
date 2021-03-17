import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {v4 as uuid} from 'uuid';
import {API_BASE_URL} from '@env';
import {getAxiosErrorMetadata, getAxiosErrorType} from './utils';
import Bugsnag from '@bugsnag/react-native';
import {InstallIdHeaderName, RequestIdHeaderName} from './headers';
import axiosRetry, {isIdempotentRequestError} from 'axios-retry';
import axiosBetterStacktrace from 'axios-better-stacktrace';
import {getBooleanConfigValue} from '../remote-config';
import auth from '@react-native-firebase/auth';

export default createClient(API_BASE_URL);

declare module 'axios' {
  export interface AxiosRequestConfig {
    // Should retry if network error or 5xx idempotent request
    retry?: boolean;
    // Use id token as bearer token in authorization header
    authWithIdToken?: boolean;
  }
}

function retryCondition(error: AxiosError): boolean {
  const shouldRetryWithRefreshedIdToken =
    Boolean(error.config.authWithIdToken) && error.response?.status === 401;

  const shouldRetryOnNetworkErrorOrIdempotentRequest =
    Boolean(error.config.retry) &&
    (getAxiosErrorType(error) === 'network-error' ||
      isIdempotentRequestError(error));
  return (
    shouldRetryWithRefreshedIdToken ||
    shouldRetryOnNetworkErrorOrIdempotentRequest
  );
}

export function createClient(baseUrl: string) {
  const client = axios.create({
    baseURL: baseUrl,
  });
  axiosBetterStacktrace(client, {
    errorMsg: 'Inner error',
    exposeTopmostErrorViaConfig: true,
  });
  client.interceptors.request.use(requestHandler, undefined);
  client.interceptors.request.use(requestIdTokenHandler);
  axiosRetry(client, {retries: 3, retryCondition});
  client.interceptors.response.use(undefined, responseErrorHandler);
  return client;
}

let installIdHeaderValue: string | null = null;

export function setInstallId(installId: string) {
  installIdHeaderValue = installId;
}

export const CancelToken = axios.CancelToken;
export const isCancel = axios.isCancel;

function requestHandler(config: AxiosRequestConfig): AxiosRequestConfig {
  config.headers[InstallIdHeaderName] = installIdHeaderValue;
  config.headers[RequestIdHeaderName] = uuid();
  return config;
}

async function requestIdTokenHandler(config: AxiosRequestConfig) {
  if (config.authWithIdToken) {
    const retryCount = (config['axios-retry'] as any)?.retryCount;
    const forceRefresh = retryCount > 0;
    const user = auth().currentUser;
    const idToken = await user?.getIdToken(forceRefresh);
    config.headers['Authorization'] = 'Bearer ' + idToken;
  }
  return config;
}

function responseErrorHandler(error: AxiosError) {
  const errorType = getAxiosErrorType(error);
  const topmostError = error?.config?.topmostError;

  const originalStack = error.stack;
  if (topmostError) {
    error.stack = `${error.stack}\n${topmostError.stack}`;
  }

  switch (errorType) {
    case 'default':
      const errorMetadata = getAxiosErrorMetadata(error);
      Bugsnag.notify(error, (event) => {
        event.addMetadata('api', {...errorMetadata});
      });
      break;
    case 'unknown':
      Bugsnag.notify(error);
      break;
    case 'network-error':
    case 'timeout':
      if (!isCancel(error) && getBooleanConfigValue('enable_network_logging')) {
        const errorMetadata = getAxiosErrorMetadata(error);
        Bugsnag.notify(error, (event) => {
          event.addMetadata('api', {...errorMetadata});
        });
      }
      break;
  }

  error.stack = originalStack;

  return Promise.reject(error);
}
