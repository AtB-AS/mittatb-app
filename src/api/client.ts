import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {v4 as uuid} from 'uuid';
import {API_BASE_URL} from '@env';
import {getAxiosErrorType, ErrorType, getAxiosErrorMetadata} from './utils';
import Bugsnag from '@bugsnag/react-native';
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
