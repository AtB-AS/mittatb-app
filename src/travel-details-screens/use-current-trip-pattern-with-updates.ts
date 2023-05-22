import {TripPattern} from '@atb/api/types/trips';
import {AxiosError} from 'axios';
import {useCallback, useEffect, useState} from 'react';
import {singleTripSearch} from '@atb/api/trips_v2';
import {usePollableResource} from '@atb/utils/use-pollable-resource';
import {useIsFocused} from '@react-navigation/native';

type TripPatternUpdate = {
  tp: TripPattern;
  error?: AxiosError;
};

/**
 * Hook for using the current trip pattern with updated data. Every 20 seconds the trip pattern
 * is updated with a query to the single trip search endpoint.
 *
 * The updated data for all trip patterns is persisted in the state, so it
 * doesn't go back to the original outdated trip pattern.
 */
export const useCurrentTripPatternWithUpdates = (
  originalTripPattern: TripPattern,
): {updatedTripPattern: TripPattern; error?: AxiosError} => {
  const isFocused = useIsFocused();
  const [tripPatternUpdates, setTripPatternUpdates] =
    useState<TripPatternUpdate>({tp: originalTripPattern});

  const fetchTripPattern = useCallback(
    (signal?: AbortSignal) =>
      singleTripSearch(originalTripPattern.compressedQuery, {
        signal,
      }),
    [originalTripPattern],
  );

  const [updatedTripPattern, , , error] = usePollableResource<
    TripPattern | undefined,
    AxiosError
  >(fetchTripPattern, {
    initialValue: originalTripPattern,
    pollingTimeInSeconds: 20,
    disabled: !isFocused,
  });

  useEffect(() => {
    if (error) {
      setTripPatternUpdates({tp: originalTripPattern, error});
    } else if (updatedTripPattern) {
      setTripPatternUpdates({tp: updatedTripPattern, error: undefined});
    } else {
      setTripPatternUpdates({tp: originalTripPattern, error: undefined});
    }
  }, [updatedTripPattern, error]);

  return {
    updatedTripPattern: tripPatternUpdates.tp,
    error: tripPatternUpdates.error,
  };
};
