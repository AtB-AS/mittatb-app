import axios, {AxiosError, AxiosInstance} from 'axios';
import {getAxiosErrorType, ErrorType, getAxiosErrorMetadata} from './utils';
import bugsnag from '../diagnostics/bugsnag';
import {getInstallId} from '../utils/installId';
import {InstallIdHeaderName} from './headers';

const API_BASE_URL = 'https://mittatb-bff.dev.mittatb.no/';

let axiosInstance: AxiosInstance | null = null;

export async function getClient() {
  if (!axiosInstance) {
    const installid = await getInstallId();
    axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        [InstallIdHeaderName]: installid,
      },
    });
    axiosInstance.interceptors.response.use(undefined, responseErrorHandler);
  }
  return axiosInstance;
}

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
