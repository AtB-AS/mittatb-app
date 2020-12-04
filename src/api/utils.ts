import axios, {AxiosError} from 'axios';
import {RequestIdHeaderName} from './headers';

export type ErrorType =
  | 'unknown'
  | 'default'
  | 'network-error'
  | 'timeout'
  | 'cancel';

export const getAxiosErrorType = (error: AxiosError): ErrorType => {
  if (error) {
    if (axios.isCancel(error)) {
      return 'cancel';
    }
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

  return 'unknown';
};

export interface ErrorMetadata {
  responseStatus?: number;
  responseStatusText?: string;
  responseData?: string;
  requestUrl?: string;
  requestMessage?: string;
  requestCode?: string;
  requestId?: string;
}

export const getAxiosErrorMetadata = (error: AxiosError): ErrorMetadata => ({
  requestId: error?.config?.headers[RequestIdHeaderName],
  requestCode: error?.code,
  requestUrl: error?.config?.url,
  requestMessage: error?.message,
  responseStatus: error?.response?.status,
  responseStatusText: error?.response?.statusText,
  responseData: JSON.stringify(error?.response?.data || 'No response data'),
});

export const stringifyUrl = (url: string, query: string) => `${url}?${query}`;

export type Language = 'nob' | 'nno' | 'eng';

export type LanguageAndText = {
  lang: Language;
  value: string;
};
