import {useState, useCallback, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/core';
import useInterval from './use-interval';

type PollableResourceOptions<T> = {
  initialValue: T;
  pollingTimeInSeconds?: number;
  skipRun?(): boolean;
  disabled?: boolean;
};

/**
 * Pattern for creating a pollable resource as a hook. Pass data reciever function as first argument.
 * NOTE: callback should be cached as it is used as dependency in useEffect. Remember to use `useCallback`.
 *
 * Polling time of 0 equals no polling.
 *
 * @param callback: () => Promise<T>
 * @param opts: PollableResourceOptions<T>
 * @returns [T, () => Promise<void>, boolean]
 */
export default function usePollableResource<T>(
  callback: () => Promise<T>,
  opts: PollableResourceOptions<T>,
): [T, () => Promise<void>, boolean] {
  const {initialValue, pollingTimeInSeconds = 30, skipRun} = opts;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<T>(initialValue);
  const pollTime = pollingTimeInSeconds * 1000;
  const isFocused = useIsFocused();

  const reload = useCallback(
    async function reload(
      loading: 'NO_LOADING' | 'WITH_LOADING' = 'WITH_LOADING',
    ) {
      // Only fetch if there is a location and the screen is in focus.
      if (!isFocused) {
        return;
      }

      if (skipRun && skipRun()) {
        return;
      }

      if (loading === 'WITH_LOADING') {
        setIsLoading(true);
      }
      try {
        const newState = await callback();
        setState(newState);
      } finally {
        if (loading === 'WITH_LOADING') {
          setIsLoading(false);
        }
      }
    },
    [callback, skipRun, isFocused],
  );

  useEffect(() => {
    reload('WITH_LOADING');
  }, [reload]);

  useInterval(
    () => reload('NO_LOADING'),
    pollTime,
    [reload],
    opts.disabled || !isFocused,
  );

  return [state, reload, isLoading];
}
