import {useState, useEffect, useRef} from 'react';
import isEqual from 'lodash.isequal';

/**
 * Custom hook to keep track of the previous value of a state or prop in a stable manner.
 *
 * @template T
 * @param {T} value - The current value to track.
 * @returns {T | undefined} - The previous value before the current update.
 */
export function useStablePreviousValue<T>(value: T): T | undefined {
  const [stablePreviousValue, setStablePreviousValue] = useState<
    T | undefined
  >();
  const currentRef = useRef<T | undefined>(value);

  useEffect(() => {
    if (!isEqual(currentRef.current, value)) {
      setStablePreviousValue(currentRef.current);
      currentRef.current = value;
    }
  }, [value]);

  return stablePreviousValue;
}
