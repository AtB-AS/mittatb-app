import {useEffect, useRef} from 'react';

export function useDoOnceWhen(
  fn: () => void,
  condition: boolean,
  onlyOnce?: boolean,
) {
  const isFirstTimeRef = useRef(true);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    if (isFirstTimeRef.current && condition) {
      fnRef.current();
      isFirstTimeRef.current = false;
    }

    return () => {
      if (!onlyOnce) {
        isFirstTimeRef.current = true;
      }
    };
  }, [condition, onlyOnce]);
}
