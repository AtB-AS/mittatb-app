import {useAuthState} from '@atb/auth';
import {useCallback, useEffect, useRef, useState} from 'react';
import {LoadingState} from '@atb/loading-screen/types';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useIsLoadingAppState} from '@atb/loading-screen';

export const useLoadingState = (timeoutMs: number): LoadingState => {
  const isLoadingAppState = useIsLoadingAppState();
  const {userId, authStatus, retryAuth} = useAuthState();
  const [isTimeout, setIsTimeout] = useState(false);
  const {resubscribeFirestoreConfig, firestoreConfigStatus} =
    useFirestoreConfiguration();
  const paramsRef = useRef({
    userId,
    isLoadingAppState,
    authStatus,
    firestoreConfigStatus,
  });

  const loadSuccessful =
    !isLoadingAppState &&
    authStatus === 'authenticated' &&
    firestoreConfigStatus === 'success';

  const status = loadSuccessful ? 'success' : isTimeout ? 'timeout' : 'loading';

  useEffect(() => setIsTimeout(false), [userId]);

  useEffect(() => {
    paramsRef.current = {
      userId,
      isLoadingAppState,
      authStatus,
      firestoreConfigStatus,
    };
  }, [userId, isLoadingAppState, authStatus, firestoreConfigStatus]);

  useEffect(() => {
    if (status === 'success') {
      setIsTimeout(false);
    }

    if (status === 'loading') {
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
