// import {useAnalytics} from '@atb/analytics';
import {useAppState} from '@atb/AppContext';
import {useAuthState} from '@atb/auth';
import {useCallback, useEffect, useRef, useState} from 'react';
import {LoadingState, LoadingStatus} from '@atb/loading-screen/types';

export const useLoadingState = (timeoutMs: number): LoadingState => {
  const {isLoading: isLoadingAppState} = useAppState();
  const {authStatus, retryAuth} = useAuthState();

  const [status, setStatus] = useState<LoadingStatus>('loading');

  const paramsRef = useRef({isLoadingAppState, authStatus});

  useEffect(() => {
    if (!isLoadingAppState && authStatus === 'authenticated') {
      setStatus('success');
    } else {
      setStatus((prev) => (prev === 'timeout' ? 'timeout' : 'loading'));
    }
    paramsRef.current = {isLoadingAppState, authStatus};
  }, [isLoadingAppState, authStatus]);

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
    }
  }, [status, authStatus, retryAuth]);

  return {
    status,
    retry,
    paramsRef,
  };
};
