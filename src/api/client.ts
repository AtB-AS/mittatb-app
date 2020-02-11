import axios, {AxiosError} from 'axios';
import {getAxiosErrorType, ErrorType, getAxiosErrorMetadata} from './utils';
import bugsnag from '../diagnostics/bugsnag';
const API_BASE_URL = 'https://mittatb-bff.dev.mittatb.no/';

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.response.use(undefined, responseErrorHandler);

function responseErrorHandler(error: AxiosError) {
  const errorType = getAxiosErrorType(error);
  switch (errorType) {
    case ErrorType.Normal:
      const errorMetadata = getAxiosErrorMetadata(error);
      bugsnag.notify(error, report => {
        report.metadata = {
          ...report.metadata,
          api: {
            ...errorMetadata,
          },
        };
      });
    case ErrorType.Unknown:
      bugsnag.notify(error);
    case ErrorType.NetworkError:
    case ErrorType.Timeout:
      // This happens all the time in mobile apps,
      // so will be a lot of noise if we choose to report these
      console.warn(errorType, error);
  }

  return Promise.reject(error);
}

export default client;
