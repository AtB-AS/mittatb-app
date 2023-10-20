import {AuthStatus} from '@atb/auth';
import {RefObject} from 'react';

export type LoadingStatus = 'loading' | 'success' | 'timeout';

export type LoadingParams = {
  isLoadingAppState: boolean;
  authStatus: AuthStatus;
  hasFirestoreConfigData: boolean;
};

export type LoadingState = {
  status: LoadingStatus;
  retry: () => void;
  /**
     The parameters used to deduce the loading status are returned as a ref object,
     so they can be used in logging, error reporting etc. without causing
     rerenders.
     */
  paramsRef: RefObject<LoadingParams>;
};
