import axios, {AxiosError, Cancel} from 'axios';
import {FirebaseAuthIdHeaderName, RequestIdHeaderName} from './headers';
import {ErrorResponse} from '@atb-as/utils';
import {PartialField} from '@atb/utils/object';

/**
 * Error from API requests or Axios client errors.
 * The `http` field may be undefined for network errors, timeouts, or cancellations.
 * For errors with guaranteed `http` field, use `ErrorResponse` from '@atb-as/utils'.
 */
export type RequestError = PartialField<ErrorResponse, 'http'>;

type ErrorType = 'unknown' | 'default' | 'network-error' | 'timeout' | 'cancel';

export type AxiosErrorKind =
  | 'AXIOS_UNKNOWN'
  | 'AXIOS_NETWORK_ERROR'
  | 'AXIOS_TIMEOUT'
  | 'AXIOS_CANCEL'
  | 'UNKNOWN';

export const toAxiosErrorKind = (kind: string | undefined): AxiosErrorKind => {
  switch (kind) {
    case 'AXIOS_UNKNOWN':
    case 'AXIOS_NETWORK_ERROR':
    case 'AXIOS_TIMEOUT':
    case 'AXIOS_CANCEL':
    case 'UNKNOWN':
      return kind;
    default:
      return 'UNKNOWN';
  }
};

export const getAxiosErrorType = (
  error: AxiosError | Cancel | unknown,
  didTimeOut: boolean = false,
): ErrorType => {
  if (error) {
    if (axios.isCancel(error)) {
      return didTimeOut ? 'timeout' : 'cancel';
    }
    if (axios.isAxiosError(error)) {
      if (error.response && error.code !== 'ERR_NETWORK') {
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

export const getErrorResponse = (
  error: AxiosError,
): RequestError | undefined => {
  return ErrorResponse.safeParse(error?.response?.data).data;
};

export const isErrorResponse = (error: any): error is ErrorResponse => {
  return ErrorResponse.safeParse(error).success;
};

export const errorDetailsToResponseData = (
  error: RequestError,
): any | undefined => {
  return (error.details?.find((d: any) => 'responseData' in d) as any)
    .responseData;
};

export const stringifyUrl = (url: string, query: string) => `${url}?${query}`;
