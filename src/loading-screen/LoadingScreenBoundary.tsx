import React from 'react';
import {LoadingScreen} from './LoadingScreen';
import {LoadingErrorScreen} from './LoadingErrorScreen';
import {useLoadingScreenEnabled} from '@atb/loading-screen/use-loading-screen-enabled';
import {useDelayGate} from '@atb/utils/use-delay-gate';
import {useLoadingErrorScreenEnabled} from '@atb/loading-screen/use-loading-error-screen-enabled';
import {useLoadingState} from '@atb/loading-screen/use-loading-state';
import {useNotifyBugsnagOnTimeoutStatus} from '@atb/loading-screen/use-notify-bugsnag-on-timeout-status';

const LOADING_TIMEOUT_MS = 10000;

export const LoadingScreenBoundary = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const loadingScreenEnabled = useLoadingScreenEnabled();
  const errScreenEnabled = useLoadingErrorScreenEnabled();
  const {status, retry, paramsRef} = useLoadingState(LOADING_TIMEOUT_MS);
  useNotifyBugsnagOnTimeoutStatus(status, paramsRef);

  // Wait one second after load success to let the app "settle".
  const waitFinished = useDelayGate(1000, status === 'success');

  if (!loadingScreenEnabled) return children;

  switch (status) {
    case 'loading':
      return <LoadingScreen />;
    case 'timeout':
      return errScreenEnabled ? <LoadingErrorScreen retry={retry} /> : children;
    case 'success':
      return waitFinished ? children : <LoadingScreen />;
  }
};
