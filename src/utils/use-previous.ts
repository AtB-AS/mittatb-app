import {useEffect, useRef} from 'react';

/**
 * Returns a current reference to the previous value. The returned value is safe
 * to use in dependency arrays as refs won't trigger reruns.
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
