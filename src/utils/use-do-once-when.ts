import {useEffect, useRef} from 'react';

export function useDoOnceWhen(fn: () => void, condition: boolean) {
  const firstTimeRef = useRef(true);
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    if (firstTimeRef.current && condition) {
      firstTimeRef.current = false;
      fnRef.current();
    }
    return () => {
      firstTimeRef.current = true;
    };
  }, [condition]);
}
