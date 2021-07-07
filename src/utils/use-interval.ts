import {useRef, useEffect} from 'react';

export default function useInterval(
  callback: Function,
  delay: number,
  deps: React.DependencyList = [],
  disabled: boolean = false,
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
    if (delay !== null && !disabled) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, disabled].concat(deps));
}
