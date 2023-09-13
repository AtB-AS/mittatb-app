import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {v4 as uuid} from 'uuid';
import {API_BASE_URL, APP_VERSION, IOS_BUNDLE_IDENTIFIER} from '@env';
import {getAxiosErrorMetadata, getAxiosErrorType} from './utils';
import Bugsnag from '@bugsnag/react-native';
import {
  AppVersionHeaderName,
  FirebaseAuthIdHeaderName,
  InstallIdHeaderName,
  RequestIdHeaderName,
} from './headers';
import axiosRetry, {isIdempotentRequestError} from 'axios-retry';
import axiosBetterStacktrace from 'axios-better-stacktrace';
import {getBooleanConfigValue} from '../remote-config';
import auth from '@react-native-firebase/auth';
import {Platform} from 'react-native';

export const client = createClient(API_BASE_URL);

const RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 15000;

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
  const isRateLimited = error.response?.status === 429;
  if (isRateLimited) return false;

  const shouldForceRefresh = error.config?.forceRefreshIdToken;
  if (shouldForceRefresh) return true;

  const shouldRetryOnNetworkErrorOrIdempotentRequest =
    Boolean(error.config?.retry) &&
    (getAxiosErrorType(error) === 'network-error' ||
      isIdempotentRequestError(error));
  return shouldRetryOnNetworkErrorOrIdempotentRequest;
}

export function createClient(baseUrl: string | undefined) {
  const client = axios.create({
    baseURL: baseUrl,
  });
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

  config.headers[AppVersionHeaderName] = APP_VERSION;

  return config;
}

async function requestIdTokenHandler(config: AxiosRequestConfig) {
  if (config.authWithIdToken) {
    const user = auth().currentUser;
    const idToken = await user?.getIdToken(config.forceRefreshIdToken);
    config.headers = {
      ...(config.headers || {}),
      Authorization: 'Bearer ' + idToken,
      'atb-app-identifier': IOS_BUNDLE_IDENTIFIER,
      'atb-app-platform': Platform.OS,
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
      console.log(
        'client, enable_network_logging: ',
        !isCancel(error),
        getBooleanConfigValue('enable_network_logging'),
      );
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

export type TimeoutRequest = {
  didTimeout: boolean;
  signal: AbortSignal;
  start(): void;
  clear(): void;
  abort(): void;
};

export const useTimeoutRequest = (): TimeoutRequest => {
  const controller = new AbortController();
  var didTimeout = false;
  var timerId: NodeJS.Timeout | undefined;

  const start = () => {
    timerId = setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, DEFAULT_TIMEOUT);
  };

  return {
    didTimeout,
    signal: controller.signal,
    start,
    clear: () => {
      timerId && clearTimeout(timerId);
    },
    abort: () => controller.abort(),
  };
};
