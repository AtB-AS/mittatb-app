import {useCallback, useEffect, useRef} from 'react';
import {storage} from '@atb/storage';

import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {useHasSeenShareTravelHabitsScreen} from './use-has-seen-share-travel-habits-screen';
import {useAppState} from '@atb/AppContext';
import {useBeaconsState} from './BeaconsContext';

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
  const {isBeaconsSupported, kettleInfo} = useBeaconsState();

  const appStatus = useAppStateStatus();

  const {onboarded} = useAppState();
  const [hasSeenShareTravelHabitsScreen] = useHasSeenShareTravelHabitsScreen();
  const enabled =
    onboarded &&
    isBeaconsSupported &&
    hasSeenShareTravelHabitsScreen !== null &&
    !hasSeenShareTravelHabitsScreen;

  const maybeShowShareTravelHabitsScreen = useCallback(async () => {
    if (!kettleInfo?.isBeaconsOnboarded) {
      showShareTravelHabitsScreen();
    }
  }, [kettleInfo, showShareTravelHabitsScreen]);

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
