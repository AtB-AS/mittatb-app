import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {v4 as uuid} from 'uuid';
import {API_BASE_URL, APP_VERSION, IOS_BUNDLE_IDENTIFIER} from '@env';
import {getAxiosErrorMetadata, getAxiosErrorType} from './utils';
import Bugsnag from '@bugsnag/react-native';
import {
  AppIdentifierHeaderName,
  AppVersionHeaderName,
  FirebaseAuthIdHeaderName,
  InstallIdHeaderName,
  PlatformHeaderName,
  PlatformVersionHeaderName,
  RequestIdHeaderName,
  Authorization,
} from './headers';
import axiosRetry, {isIdempotentRequestError} from 'axios-retry';
import axiosBetterStacktrace from 'axios-better-stacktrace';
import auth from '@react-native-firebase/auth';
import {Platform} from 'react-native';
import {SHOULD_FORCE_REFRESH} from '@atb/auth/AuthContext';

type InternalUpstreamServerError = {
  errorCode: 602;
  shortNorwegian: string;
  shortEnglish: string;
};

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

function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  config.headers[RequestIdHeaderName] = uuid();

  if (installIdHeaderValue) {
    config.headers[InstallIdHeaderName] = installIdHeaderValue;
  }

  const authId = auth().currentUser?.uid;
  if (authId) {
    config.headers[FirebaseAuthIdHeaderName] = authId;
  }

  config.headers[AppVersionHeaderName] = APP_VERSION;
  config.headers[PlatformHeaderName] = Platform.OS;
  config.headers[PlatformVersionHeaderName] = Platform.Version;
  config.headers[AppIdentifierHeaderName] = IOS_BUNDLE_IDENTIFIER;

  return config;
}

async function requestIdTokenHandler(config: InternalAxiosRequestConfig) {
  if (config.authWithIdToken) {
    const user = auth().currentUser;
    const tokenResult = await user?.getIdTokenResult(config.forceRefreshIdToken);
    if (config.forceRefreshIdToken && tokenResult?.claims['customer_number']) {
      SHOULD_FORCE_REFRESH.value = true;
    }

    const idToken = tokenResult?.token;
    config.headers[Authorization] = 'Bearer ' + idToken;
  }
  return config;
}

function responseIdTokenHandler(error: AxiosError) {
  if (error?.config && error.response?.status) {
    error.config.forceRefreshIdToken = error.config.authWithIdToken && [401, 403, 500, 502, 503].includes(error.response?.status);
  }
  throw error;
}

function isInternalUpstreamServerError(
  e: any,
): e is InternalUpstreamServerError {
  return 'errorCode' in e && 'shortNorwegian' in e;
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
      break;
  }
  const variable: any = error?.response?.data;
  if (variable?.upstreamError) {
    const upstreamError = JSON.parse(variable.upstreamError);
    if (isInternalUpstreamServerError(upstreamError)) {
      return Promise.reject({...error, status: upstreamError.errorCode});
    }
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
  let didTimeout = false;
  let timerId: number | undefined;

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
