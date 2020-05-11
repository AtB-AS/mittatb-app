import {AxiosError} from 'axios';
import {RequestIdHeaderName} from './headers';

export enum ErrorType {
  Unknown,
  Normal,
  NetworkError,
  Timeout,
}

export const getAxiosErrorType = (error: AxiosError): ErrorType => {
  if (error) {
    if (error.response) {
      return ErrorType.Normal;
    } else {
      if (error.code === 'ECONNABORTED') {
        return ErrorType.Timeout;
      } else {
        return ErrorType.NetworkError;
      }
    }
  }

  return ErrorType.Unknown;
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
