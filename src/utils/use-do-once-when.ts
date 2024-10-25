import {useEffect, useRef} from 'react';
/**
 * @param fn The function to run.
 * @param condition fn will be run when condition is true, unless it has already run once and onlyOnce is true.
 * @param onlyOnce Set to true if fn should not be re-run after condition goes back between true and false.
 */
export function useDoOnceWhen(
  fn: () => void,
  condition: boolean,
  onlyOnce?: boolean,
) {
  const hasRunRef = useRef(false);

  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const onlyOnceRef = useRef(onlyOnce);
  useEffect(() => {
    onlyOnceRef.current = onlyOnce;
  }, [onlyOnce]);

  useEffect(() => {
    if (!hasRunRef.current && condition) {
      fnRef.current();
      hasRunRef.current = true;
    }

    return () => {
      if (!onlyOnceRef.current) {
        hasRunRef.current = false;
      }
    };
  }, [condition]);
}
