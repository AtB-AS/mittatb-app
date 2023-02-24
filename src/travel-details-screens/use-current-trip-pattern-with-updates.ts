import {TripPattern} from '@atb/api/types/trips';
import {AxiosError} from 'axios';
import {useCallback, useEffect, useState} from 'react';
import {singleTripSearch} from '@atb/api/trips_v2';
import usePollableResource from '@atb/utils/use-pollable-resource';
import {useIsFocused} from '@react-navigation/native';

type TripPatternUpdate = {
  tp?: TripPattern;
  error?: AxiosError;
};

/**
 * Hook for using the current trip pattern with updated data. The current trip
 * pattern is based on the current index, and every 30 seconds the trip pattern
 * is updated with a query to the single trip search endpoint.
 *
 * The updated data for all trip patterns is persisted in the state, so it
 * doesn't go back to the original outdated trip pattern when navigating between
 * indexes.
 */
export const useCurrentTripPatternWithUpdates = (
  currentIndex: number,
  originalTripPatterns: TripPattern[],
) => {
  const isFocused = useIsFocused();
  const [tripPatternUpdates, setTripPatternUpdates] = useState<
    TripPatternUpdate[]
  >(originalTripPatterns.map(() => ({})));

  const fetchTripPattern = useCallback(
    (signal?: AbortSignal) =>
      singleTripSearch(originalTripPatterns[currentIndex].compressedQuery, {
        signal,
      }),
    [originalTripPatterns, currentIndex],
  );

  const [updatedTripPattern, , , error] = usePollableResource<
    TripPattern | undefined,
    AxiosError
  >(fetchTripPattern, {
    initialValue: originalTripPatterns[currentIndex],
    pollingTimeInSeconds: 20,
    disabled: !isFocused,
  });

  useEffect(() => {
    const updated = tripPatternUpdates.map((existingUpdate, index) => {
      if (index === currentIndex) {
        if (error) {
          return {...existingUpdate, error};
        } else {
          return {tp: updatedTripPattern, error: undefined};
        }
      }
      return existingUpdate;
    });

    setTripPatternUpdates(updated);
  }, [updatedTripPattern, error]);

  return {
    tripPattern:
      tripPatternUpdates[currentIndex].tp ?? originalTripPatterns[currentIndex],
    error: tripPatternUpdates[currentIndex].error,
  };
};
