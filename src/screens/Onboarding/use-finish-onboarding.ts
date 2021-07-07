import {useAppState} from '@atb/AppContext';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useEffect, useState} from 'react';

export const useFinishOnboarding = () => {
  const {completeOnboarding} = useAppState();
  const {status, requestPermission} = useGeolocationState();
  const [requestedOnce, setRequestedOnce] = useState(false);
  useEffect(() => {
    if (requestedOnce && status) {
      completeOnboarding();
    }
  }, [status, requestedOnce, completeOnboarding]);

  return async () => {
    if (status !== 'granted') await requestPermission();
    setRequestedOnce(true);
  };
};
