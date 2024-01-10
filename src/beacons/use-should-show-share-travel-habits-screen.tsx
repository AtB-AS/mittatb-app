import {useCallback, useEffect, useRef, useState} from 'react';
import {storage} from '@atb/storage';

import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

import {useAppState} from '@atb/AppContext';

import {useBeaconsState} from './BeaconsContext';

export const shareTravelHabitsSessionCountKey =
  '@ATB_share_travel_habits_session_count_v2';

// note: only one instance of this hook should be used to actually count the sessions
export const useShouldShowShareTravelHabitsScreen = (
  utilizeThisHookInstanceForSessionCounting = false,
) => {
  const {
    delay_share_travel_habits_screen_by_sessions_count: runAfterSessionsCount,
  } = useRemoteConfig();
  const sessionCountRef = useRef(0);
  const [sessionCount, setSessionCount] = useState(0);
  const isInitializedRef = useRef(false);
  const {isBeaconsSupported, beaconsInfo} = useBeaconsState();

  const appStatus = useAppStateStatus();

  const {onboarded, shareTravelHabitsOnboarded} = useAppState();
  const enabled =
    onboarded && isBeaconsSupported && !shareTravelHabitsOnboarded;

  const shouldShowShareTravelHabitsScreen =
    enabled &&
    !beaconsInfo?.isConsentGranted &&
    sessionCount > runAfterSessionsCount;

  const updateCount = useCallback(
    async (currentCount: number) => {
      if (utilizeThisHookInstanceForSessionCounting) {
        const newCount = currentCount + 1;
        storage.set(shareTravelHabitsSessionCountKey, JSON.stringify(newCount));
        sessionCountRef.current = newCount;
        setSessionCount(newCount);
      } else {
        setSessionCount(currentCount);
      }
    },
    [utilizeThisHookInstanceForSessionCounting],
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
          updateCount(count);
        });
    } else {
      updateCount(sessionCountRef.current);
    }
  }, [enabled, appStatus, updateCount]);

  return shouldShowShareTravelHabitsScreen;
};
