import {AuthStatus} from '@atb/modules/auth';
import {RefObject} from 'react';
import {FirestoreConfigStatus} from '@atb/configuration/types';

export type LoadingStatus = 'loading' | 'success' | 'timeout';

export type LoadingParams = {
  userId?: string;
  isLoadingAppState: boolean;
  authStatus: AuthStatus;
  firestoreConfigStatus: FirestoreConfigStatus;
  remoteConfigIsLoaded: boolean;
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
