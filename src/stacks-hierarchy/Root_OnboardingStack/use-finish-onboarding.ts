import {useAppState} from '@atb/AppContext';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useCallback} from 'react';

export const useFinishOnboarding = () => {
  const {completeOnboarding} = useAppState();
  const {status, requestLocationPermission} = useGeolocationState();

  return useCallback(async () => {
    completeOnboarding();
    if (status !== 'granted') await requestLocationPermission();
  }, [completeOnboarding, requestLocationPermission]);
};
