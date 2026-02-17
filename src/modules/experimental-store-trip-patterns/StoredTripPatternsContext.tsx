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

export type StoredTripPatternsContextState = {
  tripPatterns: StoredTripPattern[];
  addTripPattern(tripPattern: TripPattern): Promise<void>;
  removeTripPattern(tripPattern: TripPattern): Promise<void>;
  updateTripPattern(tripPattern: TripPattern): Promise<void>;
  isTripPatternStored(tripPattern: TripPattern): boolean;
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

      const contextValue: StoredTripPatternsContextState = {
        tripPatterns,
        addTripPattern,
        removeTripPattern,
        updateTripPattern,
        isTripPatternStored,
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
