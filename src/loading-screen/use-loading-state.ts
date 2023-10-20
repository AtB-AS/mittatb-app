import {useAppState} from '@atb/AppContext';
import {useAuthState} from '@atb/auth';
import {useCallback, useEffect, useRef, useState} from 'react';
import {LoadingState, LoadingStatus} from '@atb/loading-screen/types';
import {useFirestoreConfiguration} from '@atb/configuration';

export const useLoadingState = (timeoutMs: number): LoadingState => {
  const {isLoading: isLoadingAppState} = useAppState();
  const {authStatus, retryAuth} = useAuthState();
  const [status, setStatus] = useState<LoadingStatus>('loading');
  const paramsRef = useRef({isLoadingAppState, authStatus});
  const {resubscribeFirestoreConfig, hasFirestoreConfigData} =
    useFirestoreConfiguration();

  useEffect(() => {
    if (
      !isLoadingAppState &&
      authStatus === 'authenticated' &&
      hasFirestoreConfigData
    ) {
      setStatus('success');
    } else {
      setStatus((prev) => (prev === 'timeout' ? 'timeout' : 'loading'));
    }
    paramsRef.current = {isLoadingAppState, authStatus};
  }, [isLoadingAppState, authStatus, hasFirestoreConfigData]);

  useEffect(() => {
    if (status === 'loading') {
      const id = setTimeout(() => setStatus('timeout'), timeoutMs);
      return () => clearTimeout(id);
    }
  }, [timeoutMs, status]);

  const retry = useCallback(() => {
    if (status !== 'loading') {
      setStatus('loading');
      if (authStatus !== 'authenticated') retryAuth();
      if (!hasFirestoreConfigData) {
        resubscribeFirestoreConfig();
      }
    }
  }, [status, authStatus, retryAuth, resubscribeFirestoreConfig]);

  return {status, retry, paramsRef};
};
