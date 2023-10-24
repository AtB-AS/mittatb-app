import {useCallback, useEffect, useState} from 'react';
import {useIsBeaconsEnabled} from './use-is-beacons-enabled';
import {storage} from '@atb/storage';

import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {usePrevious} from '@atb/utils/use-previous';

export const useOnBeaconsSessionCount = (
  runOnCount: number,
  runOnCountFunc: () => void,
  keyAppendix: string, // appendix to ensure unique storage keys
) => {
  const beaconsSessionCount = useBeaconsSessionCounter(
    runOnCount + 1,
    keyAppendix,
  );

  useEffect(() => {
    if (
      beaconsSessionCount !== undefined &&
      beaconsSessionCount === runOnCount
    ) {
      runOnCountFunc();
    }
  }, [beaconsSessionCount, runOnCountFunc, runOnCount]);
};

enum storeKey {
  beaconsSessionCountKey = '@ATB_session_count_',
}

const useBeaconsSessionCounter = (
  stopCountingOn: number,
  keyAppendix: string,
) => {
  const [beaconsSessionCount, setBeaconsSessionCount] = useState<
    number | undefined
  >(undefined);

  const [isBeaconsEnabled, isBeaconsEnabledDebugOverrideReady] =
    useIsBeaconsEnabled();

  const appStatus = useAppStateStatus();
  const prevAppStatus = usePrevious(appStatus);

  const setStoredBeaconsSessionCount = useCallback(
    async (count: number) => {
      setBeaconsSessionCount(count);
      await storage.set(
        storeKey.beaconsSessionCountKey + keyAppendix,
        JSON.stringify(count),
      );
    },
    [keyAppendix],
  );

  useEffect(() => {
    const loadStoredBeaconsSessionCount = async () => {
      const beaconsSessionCountString = await storage.get(
        storeKey.beaconsSessionCountKey + keyAppendix,
      );
      const beaconsSessionCount = parseInt(beaconsSessionCountString ?? '0');
      if (beaconsSessionCount < stopCountingOn) {
        setStoredBeaconsSessionCount(beaconsSessionCount + 1);
      } else {
        setBeaconsSessionCount(beaconsSessionCount);
      }
    };
    loadStoredBeaconsSessionCount();
  }, [setStoredBeaconsSessionCount, keyAppendix, stopCountingOn]); // load and conditionally increase count on app open

  useEffect(() => {
    if (
      appStatus === 'active' &&
      prevAppStatus !== 'active' &&
      beaconsSessionCount !== undefined &&
      beaconsSessionCount < stopCountingOn
    ) {
      setStoredBeaconsSessionCount(beaconsSessionCount + 1);
    }
  }, [
    appStatus,
    beaconsSessionCount,
    setStoredBeaconsSessionCount,
    stopCountingOn,
    prevAppStatus,
  ]);

  useEffect(() => {
    if (
      !isBeaconsEnabled &&
      isBeaconsEnabledDebugOverrideReady &&
      beaconsSessionCount !== 0
    ) {
      setStoredBeaconsSessionCount(0); // restart count when beacons disabled
    }
  }, [
    isBeaconsEnabled,
    isBeaconsEnabledDebugOverrideReady,
    beaconsSessionCount,
    setStoredBeaconsSessionCount,
  ]);

  return beaconsSessionCount;
};
