import isEqual from 'lodash.isequal';
import {useEffect, useRef} from 'react';

/**
 * Custom hook to memoize a prop using deep comparison. The memoized value
 * will only be updated if the new prop is not deeply equal to the current prop.
 *
 * @param {any} prop - The prop to be memoized.
 * @returns {any} - The memoized prop.
 */
export const useStableProp = (prop: any) => {
  const memoedPropRef = useRef(prop);

  useEffect(() => {
    if (!isEqual(memoedPropRef.current, prop)) {
      memoedPropRef.current = prop;
    }
  }, [prop]);

  return memoedPropRef.current;
};
