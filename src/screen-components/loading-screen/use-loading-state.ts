import {useAuthContext} from '@atb/auth';
import {useCallback, useEffect, useRef, useState} from 'react';
import {LoadingParams, LoadingState} from './types';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {useIsLoadingAppState} from '@atb/screen-components/loading-screen';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';

export const useLoadingState = (timeoutMs: number): LoadingState => {
  const isLoadingAppState = useIsLoadingAppState();
  const {userId, authStatus, retryAuth} = useAuthContext();
  const [isTimeout, setIsTimeout] = useState(false);
  const {resubscribeFirestoreConfig, firestoreConfigStatus} =
    useFirestoreConfigurationContext();
  const {isLoaded: remoteConfigIsLoaded} = useRemoteConfigContext();
  const paramsRef = useRef<LoadingParams>({
    userId,
    isLoadingAppState,
    authStatus,
    firestoreConfigStatus,
    remoteConfigIsLoaded,
  });

  const loadSuccessful =
    !isLoadingAppState &&
    authStatus === 'authenticated' &&
    firestoreConfigStatus === 'success' &&
    remoteConfigIsLoaded;

  const status = loadSuccessful ? 'success' : isTimeout ? 'timeout' : 'loading';

  useEffect(() => setIsTimeout(false), [userId]);

  useEffect(() => {
    paramsRef.current = {
      userId,
      isLoadingAppState,
      authStatus,
      firestoreConfigStatus,
      remoteConfigIsLoaded,
    };
  }, [
    userId,
    isLoadingAppState,
    authStatus,
    firestoreConfigStatus,
    remoteConfigIsLoaded,
  ]);

  useEffect(() => {
    if (status === 'success') {
      setIsTimeout(false);
    } else if (status === 'loading') {
      const id = setTimeout(() => setIsTimeout(true), timeoutMs);
      return () => clearTimeout(id);
    }
  }, [timeoutMs, status]);

  const retry = useCallback(() => {
    if (status !== 'loading') {
      setIsTimeout(false);
      if (authStatus !== 'authenticated') retryAuth();
      if (firestoreConfigStatus === 'loading') {
        resubscribeFirestoreConfig();
      }
    }
  }, [
    status,
    authStatus,
    firestoreConfigStatus,
    retryAuth,
    resubscribeFirestoreConfig,
  ]);

  return {status, retry, paramsRef};
};
