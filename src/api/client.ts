import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {v4 as uuid} from 'uuid';
import {API_BASE_URL} from 'react-native-dotenv';
import {getAxiosErrorType, ErrorType, getAxiosErrorMetadata} from './utils';
import bugsnag from '../diagnostics/bugsnag';
import {InstallIdHeaderName, RequestIdHeaderName} from './headers';

export default createClient(API_BASE_URL);

export function createClient(baseUrl: string) {
  const client = axios.create({
    baseURL: baseUrl,
  });
  client.interceptors.request.use(requestHandler, undefined);
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

function responseErrorHandler(error: AxiosError) {
  const errorType = getAxiosErrorType(error);
  switch (errorType) {
    case ErrorType.Normal:
      const errorMetadata = getAxiosErrorMetadata(error);
      bugsnag.notify(error, (report) => {
        report.metadata = {
          ...report.metadata,
          api: {
            ...errorMetadata,
          },
        };
      });
      break;
    case ErrorType.Unknown:
      bugsnag.notify(error);
      break;
    case ErrorType.NetworkError:
    case ErrorType.Timeout:
      if (!isCancel(error)) {
        // This happens all the time in mobile apps,
        // so will be a lot of noise if we choose to report these
        console.warn(errorType, error);
        warnConfig(error.config);
      }
      break;
  }

  return Promise.reject(error);
}

function warnConfig(config: AxiosRequestConfig) {
  if (!config) return;
  console.warn(`URL: ${config.baseURL}${config.url}`);
}
