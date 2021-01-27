import {useState, useCallback, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import useInterval from './use-interval';
import useDebounce from './useDebounce';
import useIsLoading from './use-is-loading';

type PollableResourceOptions<T, E> = {
  initialValue: T;
  pollingTimeInSeconds?: number;
  disabled?: boolean;
  filterError?(error: E): boolean;
};

/**
 * Pattern for creating a pollable resource as a hook. Pass data reciever function as first argument.
 * NOTE: callback should be cached as it is used as dependency in useEffect. Remember to use `useCallback`.
 *
 * Polling time of 0 equals no polling.
 *
 * @param callback: () => Promise<T>
 * @param opts: PollableResourceOptions<T>
 * @returns [T, () => Promise<void>, boolean, E]
 */
export default function usePollableResource<T, E extends Error = Error>(
  callback: () => Promise<T>,
  opts: PollableResourceOptions<T, E>,
): [T, () => Promise<void>, boolean, E?] {
  const {initialValue, pollingTimeInSeconds = 30, filterError} = opts;
  const [isLoading, setIsLoading] = useIsLoading(false);
  const [error, setError] = useState<E | undefined>(undefined);
  const [state, setState] = useState<T>(initialValue);
  const pollTime = pollingTimeInSeconds * 1000;

  const reload = useCallback(
    async function reload(
      loading: 'NO_LOADING' | 'WITH_LOADING' = 'WITH_LOADING',
    ) {
      // Only fetch if there is a location and the screen is in focus.

      if (loading === 'WITH_LOADING') {
        setIsLoading(true);
      }
      try {
        setError(undefined);
        const newState = await callback();
        setState(newState);
      } catch (e) {
        if (!filterError || filterError(e)) setError(e);
      } finally {
        if (loading === 'WITH_LOADING') {
          setIsLoading(false);
        }
      }
    },
    [callback],
  );

  useEffect(() => {
    reload('WITH_LOADING');
  }, [reload]);

  useInterval(() => reload('NO_LOADING'), pollTime, [reload], opts.disabled);

  return [state, reload, isLoading, error];
}
