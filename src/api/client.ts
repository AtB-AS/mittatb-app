import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {v4 as uuid} from 'uuid';
import {API_BASE_URL} from '@env';
import {getAxiosErrorMetadata, getAxiosErrorType} from './utils';
import Bugsnag from '@bugsnag/react-native';
import {
  FirebaseAuthIdHeaderName,
  InstallIdHeaderName,
  RequestIdHeaderName,
} from './headers';
import axiosRetry, {isIdempotentRequestError} from 'axios-retry';
import axiosBetterStacktrace from 'axios-better-stacktrace';
import {getBooleanConfigValue} from '../remote-config';
import auth from '@react-native-firebase/auth';

export default createClient(API_BASE_URL);

const RETRY_COUNT = 3;

declare module 'axios' {
  export interface AxiosRequestConfig {
    // Should retry if network error or 5xx idempotent request
    retry?: boolean;
    // Use id token as bearer token in authorization header
    authWithIdToken?: boolean;
    // Force refresh id token from firebase before request
    forceRefreshIdToken?: boolean;
    // Whether the error logging to Bugsnag should be skipped for a given error
    skipErrorLogging?: (error: AxiosError) => boolean;
  }
}

function shouldRetry(error: AxiosError): boolean {
  const shouldRetryOnNetworkErrorOrIdempotentRequest =
    Boolean(error.config?.retry) &&
    (getAxiosErrorType(error) === 'network-error' ||
      isIdempotentRequestError(error));
  return (
    error.config?.forceRefreshIdToken ||
    shouldRetryOnNetworkErrorOrIdempotentRequest
  );
}

export function createClient(baseUrl: string | undefined, timeout?: number) {
  const axiosConfig: AxiosRequestConfig = {
    baseURL: baseUrl,
  };
  if (timeout) axiosConfig.timeout = timeout;

  const client = axios.create(axiosConfig);
  axiosBetterStacktrace(client, {
    errorMsg: 'Inner error',
  });
  client.interceptors.request.use(requestHandler, undefined);
  client.interceptors.request.use(requestIdTokenHandler);
  client.interceptors.response.use(undefined, responseIdTokenHandler);
  client.interceptors.response.use(undefined, responseErrorHandler);
  axiosRetry(client, {retries: RETRY_COUNT, retryCondition: shouldRetry});
  return client;
}

let installIdHeaderValue: string | null = null;

export function setInstallId(installId: string) {
  installIdHeaderValue = installId;
}

export const CancelToken = axios.CancelToken;
export const isCancel = axios.isCancel;

function requestHandler(config: AxiosRequestConfig): AxiosRequestConfig {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers[RequestIdHeaderName] = uuid();

  if (installIdHeaderValue) {
    config.headers[InstallIdHeaderName] = installIdHeaderValue;
  }

  const authId = auth().currentUser?.uid;
  if (authId) {
    config.headers[FirebaseAuthIdHeaderName] = authId;
  }
  return config;
}

async function requestIdTokenHandler(config: AxiosRequestConfig) {
  if (config.authWithIdToken) {
    const user = auth().currentUser;
    const idToken = await user?.getIdToken(config.forceRefreshIdToken);
    config.headers = {
      ...(config.headers || {}),
      Authorization: 'Bearer ' + idToken,
    };
  }
  return config;
}

function responseIdTokenHandler(error: AxiosError) {
  if (error?.config) {
    error.config.forceRefreshIdToken =
      error.config.authWithIdToken && error.response?.status === 401;
  }
  throw error;
}

function responseErrorHandler(error: AxiosError) {
  if (shouldSkipLogging(error)) {
    return Promise.reject(error);
  }

  const errorType = getAxiosErrorType(error);
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
          event.severity = 'info';
        });
      }
      break;
  }

  return Promise.reject(error);
}

const shouldSkipLogging = (error: AxiosError) => {
  const configuredToSkipLogging = error.config?.skipErrorLogging?.(error);
  const willRetry =
    shouldRetry(error) &&
    (error.config?.['axios-retry'] as any)?.retryCount < RETRY_COUNT;
  return configuredToSkipLogging || willRetry;
};
