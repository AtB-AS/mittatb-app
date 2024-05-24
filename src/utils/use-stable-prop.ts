import isEqual from 'lodash.isequal';
import {useEffect, useState} from 'react';

/**
 * Custom hook to memoize a prop using deep comparison. The memoized value
 * will only be updated if the new prop is not deeply equal to the current prop.
 *
 * @param {any} prop - The prop to be memoized.
 * @returns {any} - The memoized prop.
 */
export const useStableProp = (prop: any) => {
  const [stableProp, setStableProp] = useState(prop);

  useEffect(() => {
    if (!isEqual(stableProp, prop)) {
      setStableProp(prop);
    }
  }, [prop, stableProp]);

  return stableProp;
};
