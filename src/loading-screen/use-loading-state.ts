import {useAppState} from '@atb/AppContext';
import {useAuthState} from '@atb/auth';
import {useCallback, useEffect, useRef, useState} from 'react';
import {LoadingState, LoadingStatus} from '@atb/loading-screen/types';
import {useFirestoreConfiguration} from '@atb/configuration';
import {useMobileTokenContextState} from '@atb/mobile-token';

export const useLoadingState = (timeoutMs: number): LoadingState => {
  const {isLoading: isLoadingAppState} = useAppState();
  const {authStatus, retryAuth} = useAuthState();
  const {status: mobileTokenStatus, retry: retryMobileToken} =
    useMobileTokenContextState();
  const [status, setStatus] = useState<LoadingStatus>('loading');
  const {resubscribeFirestoreConfig, firestoreConfigStatus} =
    useFirestoreConfiguration();
  const paramsRef = useRef({
    isLoadingAppState,
    authStatus,
    firestoreConfigStatus,
    mobileTokenStatus,
  });

  useEffect(() => {
    if (
      !isLoadingAppState &&
      authStatus === 'authenticated' &&
      firestoreConfigStatus === 'success' &&
      mobileTokenStatus === 'success'
    ) {
      setStatus('success');
    } else {
      setStatus((prev) => (prev === 'timeout' ? 'timeout' : 'loading'));
    }
    paramsRef.current = {
      isLoadingAppState,
      authStatus,
      firestoreConfigStatus,
      mobileTokenStatus,
    };
  }, [isLoadingAppState, authStatus, firestoreConfigStatus, mobileTokenStatus]);

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
      if (mobileTokenStatus !== 'success') retryMobileToken();
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
