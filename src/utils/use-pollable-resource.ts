import {useCallback, useEffect, useState} from 'react';
import {useInterval} from './use-interval';
import {useIsLoading} from './use-is-loading';
import {usePrevious} from '@atb/utils/use-previous';

type PollableResourceOptions<T> = {
  initialValue: T;
  pollingTimeInSeconds?: number;
  disabled?: boolean;
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
  callback: (
    signal?: AbortSignal,
    previousState?: T,
    isInitialLoad?: boolean,
  ) => Promise<T>,
  opts: PollableResourceOptions<T>,
): [
  T,
  (loading: LoadingState, abortController?: AbortController) => Promise<void>,
  boolean,
  E?,
] => {
  const {initialValue, pollingTimeInSeconds = 30} = opts;
  const [isLoading, setIsLoading] = useIsLoading(false);
  const [error, setError] = useState<E | undefined>(undefined);
  const [state, setState] = useState<T>(initialValue);
  const [abortController, setAbortController] = useState<AbortController>();
  const pollTime = pollingTimeInSeconds * 1000;

  const prevState = usePrevious(state);

  const reload = useCallback(
    async function reload(
      loading: LoadingState = 'WITH_LOADING',
      abortController?: AbortController,
    ) {
      // Only fetch if there is a location and the screen is in focus.
      if (loading === 'WITH_LOADING') {
        setIsLoading(true);
      }
      try {
        const newState = await callback(
          abortController?.signal,
          prevState,
          loading === 'WITH_LOADING',
        );
        setError(undefined);
        setState(newState);
      } catch (e: any) {
        if (!abortController?.signal.aborted) setError(e);
      } finally {
        if (loading === 'WITH_LOADING') {
          setIsLoading(false);
        }
      }
    },
    [callback],
  );

  useEffect(() => {
    const abortController = new AbortController();
    setAbortController(abortController);
    reload('WITH_LOADING', abortController).catch(setError);
    return () => abortController.abort();
  }, [reload]);

  useInterval(
    () => reload('NO_LOADING', abortController),
    pollTime,
    [reload],
    opts.disabled,
  );

  return [state, reload, isLoading, error];
};
