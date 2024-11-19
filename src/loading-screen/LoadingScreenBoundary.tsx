import React from 'react';
import {LoadingScreen} from './LoadingScreen';
import {LoadingErrorScreen} from './LoadingErrorScreen';
import {useDelayGate} from '@atb/utils/use-delay-gate';
import {useLoadingState} from '@atb/loading-screen/use-loading-state';
import {useNotifyBugsnagOnTimeoutStatus} from '@atb/loading-screen/use-notify-bugsnag-on-timeout-status';
import {useFeatureToggles} from '@atb/feature-toggles';

const LOADING_TIMEOUT_MS = 10000;

export const LoadingScreenBoundary = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const {isLoadingScreenEnabled, isLoadingErrorScreenEnabled} =
    useFeatureToggles();
  const {status, retry, paramsRef} = useLoadingState(LOADING_TIMEOUT_MS);
  useNotifyBugsnagOnTimeoutStatus(status, paramsRef);

  // Wait 200ms after load success to let the app "settle".
  const waitFinished = useDelayGate(200, status === 'success');

  if (!isLoadingScreenEnabled) return children;

  switch (status) {
    case 'loading':
      return <LoadingScreen />;
    case 'timeout':
      return isLoadingErrorScreenEnabled ? (
        <LoadingErrorScreen retry={retry} />
      ) : (
        children
      );
    case 'success':
      return waitFinished ? children : <LoadingScreen />;
  }
};
