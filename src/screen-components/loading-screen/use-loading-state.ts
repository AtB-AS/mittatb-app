import {useAuthContext} from '@atb/modules/auth';
import {useEffect, useRef, useState} from 'react';
import {LoadingParams, LoadingState} from './types';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useIsLoadingAppState} from '@atb/screen-components/loading-screen';
import {useRemoteConfigContext} from '@atb/modules/remote-config';

export const useLoadingState = (timeoutMs: number): LoadingState => {
  const isLoadingAppState = useIsLoadingAppState();
  const {userId, authStatus} = useAuthContext();
  const [isTimeout, setIsTimeout] = useState(false);
  const {firestoreConfigStatus} = useFirestoreConfigurationContext();
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

  return {status, paramsRef};
};
