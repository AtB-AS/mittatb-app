import isEqual from 'lodash.isequal';
import {useEffect, useState} from 'react';

/**
 * Custom hook to memoize a prop using deep comparison. The memoized value
 * will only be updated if the new prop is not deeply equal to the current prop.
 *
 * @template T
 * @param {T} prop - The prop to be memoized.
 * @returns {T} - The memoized prop.
 */
export const useStableProp = <T>(prop: T): T => {
  const [stableProp, setStableProp] = useState<T>(prop);

  useEffect(() => {
    if (!isEqual(stableProp, prop)) {
      setStableProp(prop);
    }
  }, [prop, stableProp]);

  return stableProp;
};
