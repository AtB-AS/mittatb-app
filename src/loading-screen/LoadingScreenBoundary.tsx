import React, {useEffect} from 'react';
import {LoadingScreen} from './LoadingScreen';
import {LoadingErrorScreen} from './LoadingErrorScreen';
import {useLoadingScreenEnabled} from '@atb/loading-screen/use-loading-screen-enabled';
import {useDelayGate} from '@atb/utils/use-delay-gate';
import {useLoadingErrorScreenEnabled} from '@atb/loading-screen/use-loading-error-screen-enabled';
import {useLoadingState} from '@atb/loading-screen/use-loading-state';
import {useAnalytics} from '@atb/analytics';

const LOADING_TIMEOUT_MS = 10000;

export const LoadingScreenBoundary = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const loadingScreenEnabled = useLoadingScreenEnabled();
  const errScreenEnabled = useLoadingErrorScreenEnabled();
  const analytics = useAnalytics();
  const {
    status: loadingStatus,
    retry,
    paramsRef: loadingParamsRef,
  } = useLoadingState(LOADING_TIMEOUT_MS);

  // Wait one second after load success to let the app "settle".
  const waitFinished = useDelayGate(1000, loadingStatus === 'success');

  useEffect(() => {
    if (loadingStatus === 'timeout') {
      analytics.logEvent(
        'Loading boundary',
        'Loading boundary timeout',
        loadingParamsRef.current || undefined,
      );
    }
  }, [analytics, loadingStatus, loadingParamsRef]);

  if (!loadingScreenEnabled) return children;

  switch (loadingStatus) {
    case 'loading':
      return <LoadingScreen />;
    case 'timeout':
      return errScreenEnabled ? <LoadingErrorScreen retry={retry} /> : children;
    case 'success':
      return waitFinished ? children : <LoadingScreen />;
  }
};
