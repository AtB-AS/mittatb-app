import axios, {AxiosError, Cancel} from 'axios';
import {FirebaseAuthIdHeaderName, RequestIdHeaderName} from './headers';
import {z} from 'zod';

/** https://github.com/AtB-AS/amp-rs/blob/main/amp-http/src/lib.rs */
const HttpError = z.object({
  code: z.number(),
  message: z.string(),
});
type HttpError = z.infer<typeof HttpError>;

/** https://github.com/AtB-AS/amp-rs/blob/main/amp-http/src/lib.rs */
export const ErrorResponse = z.object({
  http: HttpError,
  kind: z.string(),
  message: z.string().nullish(),
  details: z.array(z.unknown()).nullish(),
});
export type ErrorResponse = z.infer<typeof ErrorResponse>;

export type ErrorType =
  | 'unknown'
  | 'default'
  | 'network-error'
  | 'timeout'
  | 'cancel';

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
): ErrorResponse | undefined => {
  return ErrorResponse.safeParse(error?.response?.data).data;
};

export const stringifyUrl = (url: string, query: string) => `${url}?${query}`;
