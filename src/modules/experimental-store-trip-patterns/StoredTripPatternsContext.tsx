import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {StoredTripPattern, storedTripPatterns} from './storage';
import {TripPattern} from '@atb/api/types/trips';
import {getTripPatternKey} from './utils';
import {wrapWithExperimentalFeatureToggledComponent} from '@atb/modules/experimental';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {useTimeContext} from '@atb/modules/time';

export type StoredTripPatternsContextState = {
  tripPatterns: StoredTripPattern[];
  addTripPattern(tripPattern: TripPattern): Promise<void>;
  removeTripPattern(tripPattern: TripPattern): Promise<void>;
  updateTripPattern(tripPattern: TripPattern): Promise<void>;
  isTripPatternStored(tripPattern: TripPattern): boolean;
  canAddTripPattern(tripPattern: TripPattern): boolean;
};
const StoredTripPatternsContext = createContext<
  StoredTripPatternsContextState | undefined
>(undefined);

export const StoredTripPatternsContextProvider =
  wrapWithExperimentalFeatureToggledComponent<React.PropsWithChildren>(
    'render-children-if-disabled',
    ({children}) => {
      const [tripPatterns, setTripPatternsState] = useState<
        StoredTripPattern[]
      >([]);
      const {serverNow} = useTimeContext(ONE_MINUTE_MS);

      const populateTripPatterns = useCallback(async () => {
        const tripPatterns = await storedTripPatterns.getTripPatterns();
        setTripPatternsState(tripPatterns ?? []);
      }, []);

      useEffect(() => {
        populateTripPatterns();
      }, [populateTripPatterns]);

      const addTripPattern = useCallback(async (tripPattern: TripPattern) => {
        const newTripPatterns =
          await storedTripPatterns.addTripPattern(tripPattern);
        setTripPatternsState(newTripPatterns);
      }, []);

      const removeTripPattern = useCallback(
        async (tripPattern: TripPattern) => {
          const newTripPatterns =
            await storedTripPatterns.removeTripPattern(tripPattern);
          setTripPatternsState(newTripPatterns);
        },
        [],
      );

      const updateTripPattern = useCallback(
        async (tripPattern: TripPattern) => {
          const newTripPatterns =
            await storedTripPatterns.updateTripPattern(tripPattern);
          setTripPatternsState(newTripPatterns);
        },
        [],
      );

      const isTripPatternStored = useCallback(
        (tripPattern: TripPattern) => {
          return tripPatterns.some(
            (tp) => tp.key === getTripPatternKey(tripPattern),
          );
        },
        [tripPatterns],
      );

      const canAddTripPattern = useCallback((tripPattern: TripPattern) => {
        return tripPattern && tripPattern.legs.filter((l) => l.id).length > 0;
      }, []);

      const removeTripPatternsOlderThan = useCallback(async (date: Date) => {
        const newTripPatterns =
          await storedTripPatterns.removeTripPatternsOlderThan(date);
        setTripPatternsState(newTripPatterns);
      }, []);

      useEffect(() => {
        removeTripPatternsOlderThan(new Date(serverNow));
      }, [serverNow, removeTripPatternsOlderThan]);

      const contextValue: StoredTripPatternsContextState = {
        tripPatterns,
        addTripPattern,
        removeTripPattern,
        updateTripPattern,
        isTripPatternStored,
        canAddTripPattern,
      };

      return (
        <StoredTripPatternsContext.Provider value={contextValue}>
          {children}
        </StoredTripPatternsContext.Provider>
      );
    },
  );

export function useStoredTripPatterns() {
  const context = useContext(StoredTripPatternsContext);
  if (context === undefined) {
    throw new Error(
      'useStoredTripPatterns must be used within a StoredTripPatternsContextProvider',
    );
  }
  return context;
}
