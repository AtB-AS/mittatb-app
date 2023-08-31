import {useEffect, useRef} from 'react';

export function useInterval(
  callback: Function,
  delay: number,
  deps: React.DependencyList = [],
  disabled: boolean = false,
  triggerImmediately: boolean = false,
) {
  const savedCallback = useRef<Function>(() => {});
  const requestId = useRef<number | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (disabled) return;
    let lastTime = Date.now();
    function tick() {
      const now = Date.now();
      const deltaTime = now - lastTime;
      if (deltaTime > delay) {
        savedCallback.current();
        lastTime = now - (deltaTime % delay);
      }
      requestId.current = requestAnimationFrame(tick);
    }
    if (triggerImmediately) {
      savedCallback.current();
    }
    if (delay !== null) {
      requestId.current = requestAnimationFrame(tick);
      return () => {
        requestId.current && cancelAnimationFrame(requestId.current);
      };
    }
  }, [delay, disabled].concat(deps));
}
