import {storage} from '@atb/storage';
import {useState, useCallback, useEffect} from 'react';

export const hasSeenShareTravelHabitsScreenKey =
  '@ATB_has_seen_share_travel_habits_screen';

export const useHasSeenShareTravelHabitsScreen = () => {
  const [hasSeenShareTravelHabitsScreen, setHasSeenShareTravelHabitsScreen] =
    useState<boolean | null>(null);

  const setAndStoreHasSeenShareTravelHabitsScreen = useCallback(
    async (hasSeen: boolean) => {
      setHasSeenShareTravelHabitsScreen(hasSeen);
      await storage.set(
        hasSeenShareTravelHabitsScreenKey,
        JSON.stringify(hasSeen),
      );
    },
    [],
  );

  useEffect(() => {
    const loadHasSeenShareTravelHabitsScreen = async () => {
      const loadedString = await storage.get(hasSeenShareTravelHabitsScreenKey);
      setHasSeenShareTravelHabitsScreen(loadedString === 'true');
    };
    loadHasSeenShareTravelHabitsScreen();
  }, []);

  return [
    hasSeenShareTravelHabitsScreen,
    setAndStoreHasSeenShareTravelHabitsScreen,
  ] as const;
};
