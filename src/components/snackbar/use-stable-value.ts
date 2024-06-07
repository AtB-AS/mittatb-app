import isEqual from 'lodash.isequal';
import {useEffect, useState} from 'react';

/**
 * Custom hook to memoize a value using deep comparison. The memoized value
 * will only be updated if the new value is not deeply equal to the current value.
 *
 * @template T
 * @param {T} value - The value to be memoized.
 * @returns {T} - The memoized value.
 */
export const useStableValue = <T>(value: T, lockValue = false): T => {
  const [stableValue, setStableValue] = useState<T>(value);

  useEffect(() => {
    if (!isEqual(stableValue, value) && !lockValue) {
      setStableValue(value);
    }
  }, [value, stableValue, lockValue]);

  return stableValue;
};
