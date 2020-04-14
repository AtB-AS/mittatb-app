import axios, {AxiosError, AxiosInstance} from 'axios';
import {API_BASE_URL} from 'react-native-dotenv';
import {getAxiosErrorType, ErrorType, getAxiosErrorMetadata} from './utils';
import bugsnag from '../diagnostics/bugsnag';
import {getInstallId} from '../utils/installId';
import {InstallIdHeaderName} from './headers';

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
      // This happens all the time in mobile apps,
      // so will be a lot of noise if we choose to report these
      // eslint-disable-next-line
      console.warn(errorType, error);
      break;
  }

  return Promise.reject(error);
}
