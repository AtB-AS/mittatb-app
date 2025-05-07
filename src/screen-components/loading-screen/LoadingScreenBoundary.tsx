import React from 'react';
import {LoadingScreen} from './LoadingScreen';
import {LoadingErrorScreen} from './LoadingErrorScreen';
import {useDelayGate} from '@atb/utils/use-delay-gate';
import {useLoadingState} from './use-loading-state';
import {useNotifyBugsnagOnTimeoutStatus} from './use-notify-bugsnag-on-timeout-status';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';

const LOADING_TIMEOUT_MS = 10000;

export const LoadingScreenBoundary = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const {isLoadingScreenEnabled, isLoadingErrorScreenEnabled} =
    useFeatureTogglesContext();
  const {loading_screen_delay_ms} = useRemoteConfigContext();
  const {status, retry, paramsRef} = useLoadingState(LOADING_TIMEOUT_MS);
  useNotifyBugsnagOnTimeoutStatus(status, paramsRef);

  // Wait after load success to let the app "settle".
  const waitFinished = useDelayGate(
    loading_screen_delay_ms,
    status === 'success',
  );

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
