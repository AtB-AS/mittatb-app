import {useCallback, useEffect, useRef, useState} from 'react';
import {useInterval} from './use-interval';
import {useIsLoading} from './use-is-loading';
import {useIsFocusedAndActive} from './use-is-focused-and-active';

type PollableResourceOptions<T> = {
  initialValue: T;
  pollingTimeInSeconds?: number;
  disabled?: boolean;
  /**
   * Disables polling on loss of focus or active app state, and polls
   * immediatelly when focus is regained.
   */
  pollOnFocus?: boolean;
};

type LoadingState = 'NO_LOADING' | 'WITH_LOADING';

/**
 * Pattern for creating a pollable resource as a hook. Pass data receiver function as first argument. The
 * receiver function may take an AbortSignal if it should be aborted when the callback function changes.
 * NOTE: callback should be cached as it is used as dependency in useEffect. Remember to use `useCallback`.
 *
 * Polling time of 0 equals no polling.
 *
 * @param callback: () => Promise<T>
 * @param opts: PollableResourceOptions<T>
 * @returns [T, () => Promise<void>, boolean, E]
 */
export const usePollableResource = <T, E extends Error = Error>(
  callback: (signal?: AbortSignal) => Promise<T>,
  opts: PollableResourceOptions<T>,
): [
  T,
  (loading: LoadingState, abortController?: AbortController) => void,
  boolean,
  E?,
] => {
  const {initialValue, pollingTimeInSeconds = 30, pollOnFocus = false} = opts;
  const isFocused = useIsFocusedAndActive();
  const firstLoadIsDone = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useIsLoading(false);
  const [error, setError] = useState<E | undefined>(undefined);
  const [state, setState] = useState<T>(initialValue);
  const abortControllerRef = useRef<AbortController>();
  const pollTime = pollingTimeInSeconds * 1000;

  const reload = useCallback(
    function reload(
      loading: LoadingState = 'WITH_LOADING',
      abortController?: AbortController,
    ) {
      if (loading === 'WITH_LOADING') {
        setIsLoading(true);
      }
      callback(abortController?.signal)
        .then((newState) => {
          setState(newState);
          setError(undefined);
          firstLoadIsDone.current = true;
        })
        .catch((e) => {
          if (!abortController?.signal.aborted) setError(e);
        })
        .finally(() => {
          if (loading === 'WITH_LOADING') {
            setIsLoading(false);
          }
        });
    },
    [callback, setIsLoading],
  );

  useEffect(() => {
    const abortController = new AbortController();
    firstLoadIsDone.current = false;
    abortControllerRef.current = abortController;
    reload('WITH_LOADING', abortController);
    return () => abortController.abort();
  }, [reload]);

  useEffect(() => {
    if (!pollOnFocus || !firstLoadIsDone.current || !isFocused) return;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    reload('NO_LOADING', abortController);
    return () => abortController.abort();
  }, [reload, isFocused, pollOnFocus]);

  useInterval(
    () => reload('NO_LOADING', abortControllerRef.current),
    [reload],
    pollTime,
    opts.disabled || (pollOnFocus && !isFocused),
  );

  return [state, reload, isLoading, error];
};
