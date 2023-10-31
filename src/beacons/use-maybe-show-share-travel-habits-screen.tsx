import {useCallback, useEffect, useRef} from 'react';
import {storage} from '@atb/storage';

import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

import {
  getHasBluetoothPermission,
  getHasLocationAlwaysAllowPermission,
  getHasLocationWhenInUsePermission,
  getHasMotionAndFitnessActivityPermission,
} from '@atb/utils/permissions';
import {useIsBeaconsEnabled} from './use-is-beacons-enabled';
import {useHasSeenShareTravelHabitsScreen} from './use-has-seen-share-travel-habits-screen';
import {useAppState} from '@atb/AppContext';

export const shareTravelHabitsSessionCountKey =
  '@ATB_share_travel_habits_session_count';

export const useMaybeShowShareTravelHabitsScreen = (
  showShareTravelHabitsScreen: () => void,
) => {
  const {
    delay_share_travel_habits_screen_by_sessions_count: runAfterSessionsCount,
  } = useRemoteConfig();
  const sessionCountRef = useRef(0);
  const isInitializedRef = useRef(false);

  const appStatus = useAppStateStatus();

  const {onboarded} = useAppState();
  const [isBeaconsEnabled, isBeaconsEnabledDebugOverrideReady] =
    useIsBeaconsEnabled();
  const [hasSeenShareTravelHabitsScreen] = useHasSeenShareTravelHabitsScreen();
  const enabled =
    onboarded &&
    isBeaconsEnabledDebugOverrideReady &&
    isBeaconsEnabled &&
    hasSeenShareTravelHabitsScreen !== null &&
    !hasSeenShareTravelHabitsScreen;

  const maybeShowShareTravelHabitsScreen = useCallback(async () => {
    if (await shouldShowShareTravelHabitsScreen()) {
      showShareTravelHabitsScreen();
    }
  }, [showShareTravelHabitsScreen]);

  const updateCount = useCallback(
    async (newCount: number) => {
      storage.set(shareTravelHabitsSessionCountKey, JSON.stringify(newCount));
      sessionCountRef.current = newCount;
      if (newCount === runAfterSessionsCount + 1) {
        maybeShowShareTravelHabitsScreen();
      }
    },
    [runAfterSessionsCount, maybeShowShareTravelHabitsScreen],
  );

  useEffect(() => {
    if (!enabled) return;
    if (appStatus !== 'active') return;

    if (!isInitializedRef.current) {
      storage
        .get(shareTravelHabitsSessionCountKey)
        .then((countStr) => parseInt(countStr ?? '0'))
        .then((count) => {
          isInitializedRef.current = true;
          updateCount(count + 1);
        });
    } else {
      updateCount(sessionCountRef.current + 1);
    }
  }, [enabled, appStatus, updateCount]);
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
