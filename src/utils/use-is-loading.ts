import {useEffect, useState} from 'react';

/**
 * A specialized useState hook for doing isLoading messages. This delays
 * setting flag as true for `delayTimeInMs`. This is to avoid unnecessary loading indicators.
 *
 * @param {boolean} initialState initial flag, true if loading false otherwise.
 * @param {number} [delayTimeInMs=400] milliseconds to delay before setting flag to true
 * @returns {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} usual useState return
 */
export function useIsLoading(
  initialState: boolean,
  delayTimeInMs: number = 400,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [isLoading, setIsLoading] = useState(initialState);
  const [isLoadingInternal, setIsLoadingInternal] = useState(initialState);

  useEffect(() => {
    if (!isLoadingInternal) {
      setIsLoading(isLoadingInternal);
      return;
    }

    const timer = setTimeout(
      () => setIsLoading(isLoadingInternal),
      delayTimeInMs,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [isLoadingInternal]);

  return [isLoading, setIsLoadingInternal];
}
