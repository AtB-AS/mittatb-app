import {useAppState} from '@atb/AppContext';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useCallback} from 'react';

export const useFinishOnboarding = () => {
  const {completeOnboarding} = useAppState();
  const {status, requestPermission} = useGeolocationState();

  return useCallback(async () => {
    completeOnboarding();
    if (status !== 'granted') await requestPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeOnboarding, requestPermission]);
};
