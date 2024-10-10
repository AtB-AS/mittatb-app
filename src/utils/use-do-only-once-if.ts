import {useEffect, useRef} from 'react';

/**
 *
 * @param fn The function to run. It will only run the very first time the condition is true.
 * @param condition Whether or not fn should be run.
 */
export function useDoOnlyOnceIf(fn: () => void, condition: boolean) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const hasRunRef = useRef(false);
  useEffect(() => {
    if (!hasRunRef.current && condition) {
      hasRunRef.current = true;
      fnRef.current();
    }
  }, [condition]);
}
