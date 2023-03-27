import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {storage, StorageModelKeysEnum} from '@atb/storage';
import {useIsVehiclesEnabled} from '@atb/mobility';

/**
 * Show the scooter onboarding if the screen is focused, vehicles feature is
 * enabled by default in Remote Config, and the onboarding is not previously
 * read.
 */
export const useShouldShowScooterOnboarding = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const isFocused = useIsFocused();
  const enabled = useIsVehiclesEnabled();

  useEffect(() => {
    if (isFocused && enabled) {
      (async function () {
        const hasRead = await storage.get(
          StorageModelKeysEnum.HasReadScooterOnboarding,
        );
        setShouldShow(hasRead ? !JSON.parse(hasRead) : true);
      })();
    } else {
      setShouldShow(false);
    }
  }, [isFocused, enabled]);

  return shouldShow;
};
