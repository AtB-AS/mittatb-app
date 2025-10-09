import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {v4 as uuid} from 'uuid';
import {API_BASE_URL, APP_VERSION, IOS_BUNDLE_IDENTIFIER} from '@env';
import {
  ErrorResponse,
  getAxiosErrorMetadata,
  getAxiosErrorType,
  HttpErrorResponse,
} from './utils';
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
  DistributionChannelHeaderName,
} from './headers';
import axiosBetterStacktrace from 'axios-better-stacktrace';
import {Platform} from 'react-native';
import {
  getCurrentUserIdGlobal,
  getIdTokenExpirationTimeGlobal,
  getIdTokenGlobal,
  getIdTokenValidityStatus,
} from '@atb/modules/auth';

export const client = createClient(API_BASE_URL);

const DEFAULT_TIMEOUT = 15000;

declare module 'axios' {
  export interface AxiosRequestConfig {
    // Use id token as bearer token in authorization header
    authWithIdToken?: boolean;
    // Whether the error logging to Bugsnag should be skipped for a given error
    skipErrorLogging?: (error: AxiosError) => boolean;
  }
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
  client.interceptors.response.use(undefined, responseErrorHandler);
  return client;
}

let installIdHeaderValue: string | null = null;

export function setInstallId(installId: string) {
  installIdHeaderValue = installId;
}

export const CancelToken = axios.CancelToken;
export const isCancel = axios.isCancel;

function requestHandler(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  config.headers[RequestIdHeaderName] = uuid();

  if (installIdHeaderValue) {
    config.headers[InstallIdHeaderName] = installIdHeaderValue;
  }

  const authId = getCurrentUserIdGlobal();
  if (authId) {
    config.headers[FirebaseAuthIdHeaderName] = authId;
  }

  config.headers[DistributionChannelHeaderName] = 'App';
  config.headers[AppVersionHeaderName] = APP_VERSION;
  config.headers[PlatformHeaderName] = Platform.OS;
  config.headers[PlatformVersionHeaderName] = Platform.Version;
  config.headers[AppIdentifierHeaderName] = IOS_BUNDLE_IDENTIFIER;

  return config;
}

async function requestIdTokenHandler(config: InternalAxiosRequestConfig) {
  if (config.authWithIdToken) {
    config.headers[Authorization] = 'Bearer ' + getIdTokenGlobal();
  }
  return config;
}

function responseErrorHandler(
  error: AxiosError,
): Promise<ErrorResponse | HttpErrorResponse> {
  const errorResponse = parseErrorResponse(error);

  if (!shouldSkipLogging(error)) {
    const errorType = getAxiosErrorType(error);
    // Only notify for default and unknown errors (matching previous behavior)
    if (errorType === 'default' || errorType === 'unknown') {
      notifyError(error);
    }
  }

  return Promise.reject(errorResponse);
}

const shouldSkipLogging = (error: AxiosError) =>
  error.config?.skipErrorLogging?.(error);

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
  let timerId: NodeJS.Timeout | undefined;

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

const parseErrorResponse = (
  error: AxiosError,
): ErrorResponse | HttpErrorResponse => {
  const errorType = getAxiosErrorType(error);

  switch (errorType) {
    case 'default':
      if (error.response) {
        const parsed = HttpErrorResponse.safeParse(error.response.data);

        if (parsed.success) {
          return parsed.data;
        }

        return {
          http: {
            code: error.response.status,
            message: error.code ?? 'UNKNOWN',
          },
          message: error.message,
          kind: 'UNKNOWN',
          details: [
            {
              responseData: error.response.data,
            },
          ],
        };
      }

      return {
        message: error.message,
        kind: 'UNKNOWN',
        details: [],
      };
    case 'unknown':
      return {
        message: error.message,
        kind: 'AXIOS_UNKNOWN',
        details: [],
      };
    case 'network-error':
      return {
        message: error.message,
        kind: 'AXIOS_NETWORK_ERROR',
        details: [],
      };
    case 'timeout':
      return {
        message: error.message,
        kind: 'AXIOS_TIMEOUT',
        details: [],
      };
    case 'cancel':
      return {
        message: error.message,
        kind: 'AXIOS_CANCEL',
        details: [],
      };
  }
};

const notifyError = (axiosError: AxiosError) => {
  const idTokenMetadata = {
    idToken: getIdTokenGlobal(),
    idTokenValidityStatus: getIdTokenValidityStatus(
      getIdTokenExpirationTimeGlobal(),
    ),
  };

  // ID token breadcrumb logging on API error
  Bugsnag.leaveBreadcrumb('ID Token', idTokenMetadata);

  const errorMetadata = getAxiosErrorMetadata(axiosError);

  Bugsnag.notify(axiosError, (event) => {
    event.addMetadata('api', {...errorMetadata});
    // ID token metadata on API error
    event.addMetadata('ID Token', idTokenMetadata);
  });
};
