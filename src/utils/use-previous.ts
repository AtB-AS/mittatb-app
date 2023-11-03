import {useEffect, useRef} from 'react';

/**
 * Returns a reference to the previous value. The returned value won't trigger
 * hook reruns as refs don't have an effect in dependency arrays.
 *
 * @param value the new value
 * @return the previous value
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
