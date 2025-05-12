import {useCallback, useEffect, useRef, useState} from 'react';
import {storage} from '@atb/modules/storage';

import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

import {useBeaconsContext} from './BeaconsContext';
import {
  getOnboardingSectionIsOnboarded,
  LoadedOnboardingSection,
} from '@atb/modules/onboarding';

export const shareTravelHabitsSessionCountKey =
  '@ATB_share_travel_habits_session_count_v2';

export const useShouldShowShareTravelHabitsScreen = (
  loadedOnboardingSections: LoadedOnboardingSection[],
) => {
  const {
    delay_share_travel_habits_screen_by_sessions_count: runAfterSessionsCount,
  } = useRemoteConfigContext();
  const sessionCountRef = useRef(0);
  const [sessionCount, setSessionCount] = useState(0);
  const isInitializedRef = useRef(false);
  const {isBeaconsSupported, isConsentGranted} = useBeaconsContext();

  const appStatus = useAppStateStatus();

  const userCreationIsOnboarded = getOnboardingSectionIsOnboarded(
    loadedOnboardingSections,
    'userCreation',
  );
  const shareTravelHabitsIsOnboarded = getOnboardingSectionIsOnboarded(
    loadedOnboardingSections,
    'shareTravelHabits',
  );

  const enabled =
    userCreationIsOnboarded &&
    isBeaconsSupported &&
    !shareTravelHabitsIsOnboarded;

  const shouldShowShareTravelHabitsScreen =
    enabled && !isConsentGranted && sessionCount > runAfterSessionsCount;

  const updateCount = useCallback(async (currentCount: number) => {
    const newCount = currentCount + 1;
    storage.set(shareTravelHabitsSessionCountKey, JSON.stringify(newCount));
    sessionCountRef.current = newCount;
    setSessionCount(newCount);
  }, []);

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
