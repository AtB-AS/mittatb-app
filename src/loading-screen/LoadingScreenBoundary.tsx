import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useAuthState} from '@atb/auth';
import {LoadingScreen} from './LoadingScreen';
import {LoadingErrorScreen} from './LoadingErrorScreen';
import {useAppState} from '@atb/AppContext';
import {useLoadingScreenEnabled} from '@atb/loading-screen/use-loading-screen-enabled';
import {useDelayGate} from '@atb/utils/use-delay-gate';
import {useAnalytics} from '@atb/analytics';
import {useLoadingErrorScreenEnabled} from '@atb/loading-screen/use-loading-error-screen-enabled';
import {useFirestoreConfiguration} from '@atb/configuration';

export const LoadingScreenBoundary = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const loadingScreenEnabled = useLoadingScreenEnabled();
  const loadingErrorScreenEnabled = useLoadingErrorScreenEnabled();
  const {isLoading: isLoadingAppState} = useAppState();
  const {authStatus, retryAuth} = useAuthState();
  const analytics = useAnalytics();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const {resubscribeFirestoreConfig, userProfiles, hasFirestoreSnapshot} =
    useFirestoreConfiguration();

  const [didTimeout, setDidTimeout] = useState(false);

  const loadSuccess =
    authStatus === 'authenticated' &&
    !isLoadingAppState &&
    // hasFirestoreSnapshot; // ?????
    console.log('hasFirestoreSnapshot: ' + hasFirestoreSnapshot);

  const setupLoadingTimeout = useCallback(() => {
    setDidTimeout(false);
    timeoutRef.current = setTimeout(() => {
      analytics.logEvent('Loading boundary', 'Loading boundary timeout', {
        isLoadingAppState,
        authStatus,
      });
      setDidTimeout(true);
    }, 10000);
  }, []);

  console.log('userProfiles: ' + userProfiles);

  const retry = useCallback(() => {
    analytics.logEvent('Loading boundary', 'Retrying auth');
    setupLoadingTimeout();
    retryAuth();
    // maybe have if-check here for whether we have firestore data cached or at all?
    if (!hasFirestoreSnapshot) {
      console.log('Resubscribe from LoadingScreenBoundary');
      analytics.logEvent(
        'Loading boundary',
        'Retrying resubscribe to Firestore config',
      ); // Add event logging?
      resubscribeFirestoreConfig();
    }
  }, [setupLoadingTimeout, retryAuth, resubscribeFirestoreConfig]); // add to dependency?

  // Wait one second after load success to let the app "settle".
  const waitFinished = useDelayGate(1000, loadSuccess);

  useEffect(() => {
    if (!loadSuccess) {
      setupLoadingTimeout();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [loadSuccess, setupLoadingTimeout]);

  if (!loadingScreenEnabled) return children;

  if (!loadSuccess) {
    if (!didTimeout) return <LoadingScreen />;
    if (loadingErrorScreenEnabled) return <LoadingErrorScreen retry={retry} />;
    return children;
  }

  return waitFinished ? children : <LoadingScreen />;
};
