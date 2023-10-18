import {useOnResume} from '@atb/utils/use-on-resume';
import {useEffect, useState} from 'react';
import {useIsBeaconsEnabled} from './use-is-beacons-enabled';
import {storage} from '@atb/storage';

export const useOnBeaconsSessionCount = (
  count: number,
  runOnCountFunc: () => void,
  keyAppendix: string, // appendix to ensure unique storage keys
) => {
  const beaconsSessionCount = useBeaconsSessionCounter(count + 1, keyAppendix);

  useEffect(() => {
    if (beaconsSessionCount !== undefined && beaconsSessionCount === count) {
      runOnCountFunc();
    }
  }, [beaconsSessionCount]);
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

  const setStoredBeaconsSessionCount = async (count: number) => {
    setBeaconsSessionCount(count);
    await storage.set(
      storeKey.beaconsSessionCountKey + keyAppendix,
      JSON.stringify(count),
    );
  };

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
  }, []); // load and conditionally increase count on app open

  useOnResume(() => {
    if (
      beaconsSessionCount !== undefined &&
      beaconsSessionCount < stopCountingOn
    ) {
      setStoredBeaconsSessionCount(beaconsSessionCount + 1);
    }
  }); // increase count on app resume

  useEffect(() => {
    if (
      !isBeaconsEnabled &&
      isBeaconsEnabledDebugOverrideReady &&
      beaconsSessionCount !== 0
    ) {
      setStoredBeaconsSessionCount(0); // restart count when beacons disabled
    }
  }, [isBeaconsEnabled, isBeaconsEnabledDebugOverrideReady]);

  return beaconsSessionCount;
};
