import {useCallback, useEffect, useState} from 'react';
import {storage} from '@atb/storage';

import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {usePrevious} from '@atb/utils/use-previous';

import {
  getHasBluetoothPermission,
  getHasLocationAlwaysAllowPermission,
  getHasLocationWhenInUsePermission,
  getHasMotionAndFitnessActivityPermission,
} from '@atb/utils/permissions';

export const beaconsSessionCountKey =
  '@ATB_beacons_session_count_share_travel_habits';

export const useMaybeShowShareTravelHabitsScreen = (
  showShareTravelHabitsScreen: () => void,
) => {
  const {delay_share_travel_habits_screen_by_sessions_count: runOnCount} =
    useRemoteConfig();
  const beaconsSessionCount = useBeaconsSessionCounter(runOnCount + 1);

  const maybeShowShareTravelHabitsScreen = useCallback(async () => {
    if (await shouldShowShareTravelHabitsScreen()) {
      showShareTravelHabitsScreen();
    }
  }, []);

  useEffect(() => {
    if (
      beaconsSessionCount !== undefined &&
      beaconsSessionCount === runOnCount
    ) {
      maybeShowShareTravelHabitsScreen();
    }
  }, [beaconsSessionCount, maybeShowShareTravelHabitsScreen, runOnCount]);
};

const useBeaconsSessionCounter = (stopCountingOn: number) => {
  const [beaconsSessionCount, setBeaconsSessionCount] = useState<
    number | undefined
  >(undefined);

  const appStatus = useAppStateStatus();
  const prevAppStatus = usePrevious(appStatus);

  const setStoredBeaconsSessionCount = useCallback(async (count: number) => {
    setBeaconsSessionCount(count);
    await storage.set(beaconsSessionCountKey, JSON.stringify(count));
  }, []);

  useEffect(() => {
    const loadStoredBeaconsSessionCount = async () => {
      const beaconsSessionCountString = await storage.get(
        beaconsSessionCountKey,
      );
      const beaconsSessionCount = parseInt(beaconsSessionCountString ?? '0');
      if (beaconsSessionCount < stopCountingOn) {
        setStoredBeaconsSessionCount(beaconsSessionCount + 1);
      } else {
        setBeaconsSessionCount(beaconsSessionCount);
      }
    };
    loadStoredBeaconsSessionCount();
  }, [setStoredBeaconsSessionCount, stopCountingOn]); // load and conditionally increase count on app open

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

  return beaconsSessionCount;
};

const shouldShowShareTravelHabitsScreen = async () => {
  const hasLocationWhenInUsePermission =
    await getHasLocationWhenInUsePermission();
  const hasLocationAlwaysAllowPermission =
    await getHasLocationAlwaysAllowPermission();
  const hasMotionAndFitnessActivityPermission =
    await getHasMotionAndFitnessActivityPermission();
  const hasBluetoothPermission = await getHasBluetoothPermission();

  const allPrerequisitePermissionsGranted = hasLocationWhenInUsePermission;

  const allPermissionsToRequestAlreadyGranted =
    hasBluetoothPermission &&
    hasLocationAlwaysAllowPermission &&
    hasMotionAndFitnessActivityPermission;

  return (
    allPrerequisitePermissionsGranted && !allPermissionsToRequestAlreadyGranted
  );
};
