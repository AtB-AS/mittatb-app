import axios, {AxiosError, Cancel} from 'axios';
import {FirebaseAuthIdHeaderName, RequestIdHeaderName} from './headers';

export type ErrorType =
  | 'unknown'
  | 'default'
  | 'network-error'
  | 'timeout'
  | 'cancel';

export const getAxiosErrorType = (
  error: AxiosError | Cancel | unknown,
): ErrorType => {
  if (error) {
    if (axios.isCancel(error)) {
      return 'cancel';
    }
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return 'default';
      } else {
        if (error.code === 'ECONNABORTED') {
          return 'timeout';
        } else {
          return 'network-error';
        }
      }
    }
  }

  return 'unknown';
};

export interface ErrorMetadata {
  responseStatus?: number;
  responseStatusText?: string;
  responseData?: string;
  requestBaseUrl?: string;
  requestUrl?: string;
  requestMessage?: string;
  requestCode?: string;
  requestId?: string;
  firebaseAuthId?: string;
}

export const getAxiosErrorMetadata = (error: AxiosError): ErrorMetadata => ({
  requestId: error?.config?.headers?.[RequestIdHeaderName] as
    | string
    | undefined,
  firebaseAuthId: error?.config?.headers?.[FirebaseAuthIdHeaderName] as
    | string
    | undefined,
  requestCode: error?.code,
  requestBaseUrl: error?.config?.baseURL,
  requestUrl: error?.config?.url,
  requestMessage: error?.message,
  responseStatus: error?.response?.status,
  responseStatusText: error?.response?.statusText,
  responseData: JSON.stringify(error?.response?.data || 'No response data'),
});

export const stringifyUrl = (url: string, query: string) => `${url}?${query}`;
