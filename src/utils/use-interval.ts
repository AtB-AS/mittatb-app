import {useRef, useEffect} from 'react';

export default function useInFocusInterval(
  callback: Function,
  delay: number,
  deps: React.DependencyList = [],
) {
  const savedCallback = useRef<Function>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay].concat(deps));
}
