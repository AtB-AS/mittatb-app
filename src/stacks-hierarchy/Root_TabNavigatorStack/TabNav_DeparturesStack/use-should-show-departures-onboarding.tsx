import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {storage, StorageModelKeysEnum} from '@atb/storage';

/**
 * Show the departures onboarding if the screen is focused, departures v2 is
 * enabled by default in Remote Config, and the onboarding is not previously
 * read.
 */
export const useShouldShowDeparturesOnboarding = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const isFocused = useIsFocused();
  const {enable_departures_v2_as_default: enabled} = useRemoteConfig();

  useEffect(() => {
    if (isFocused && enabled) {
      (async function () {
        const hasRead = await storage.get(
          StorageModelKeysEnum.HasReadDeparturesV2Onboarding,
        );
        setShouldShow(hasRead ? !JSON.parse(hasRead) : true);
      })();
    } else {
      setShouldShow(false);
    }
  }, [isFocused, enabled]);

  return shouldShow;
};
