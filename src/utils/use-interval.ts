import {useRef, useEffect} from 'react';

export default function useInterval(
  callback: Function,
  delay: number,
  deps: React.DependencyList = [],
  disabled: boolean = false,
  triggerImmediately: boolean = false,
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
    if (triggerImmediately) {
      tick();
    }
    if (delay !== null && !disabled) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, disabled].concat(deps));
}
