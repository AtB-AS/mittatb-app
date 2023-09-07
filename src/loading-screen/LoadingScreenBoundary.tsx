import React from 'react';
import {useAuthState} from '@atb/auth';
import {LoadingScreen} from './LoadingScreen';
import {LoadingErrorScreen} from './LoadingErrorScreen';
import {useAppState} from '@atb/AppContext';
import {useLoadingScreenEnabled} from '@atb/loading-screen/use-loading-screen-enabled';
import {useDelayGate} from '@atb/utils/use-delay-gate';

export const LoadingScreenBoundary = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const loadingScreenEnabled = useLoadingScreenEnabled();
  const {isLoading} = useAppState();
  const {authStatus} = useAuthState();

  // Wait one second after user authenticated to let the app "settle".
  const waitFinished = useDelayGate(1000, authStatus === 'authenticated');

  if (!loadingScreenEnabled) return children;
  if (isLoading) return <LoadingScreen />;
  if (!waitFinished) return <LoadingScreen />;

  switch (authStatus) {
    case 'loading':
    case 'creating-account':
      return <LoadingScreen />;
    case 'error':
      return <LoadingErrorScreen />;
    case 'authenticated':
      return children;
  }
};
