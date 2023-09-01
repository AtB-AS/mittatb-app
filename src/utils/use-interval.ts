import {useRef, useEffect} from 'react';

type IntervalCallback = () => Promise<void> | void;
export function useInterval(
  callback: IntervalCallback,
  delay: number,
  deps: React.DependencyList = [],
  disabled: boolean = false,
  triggerImmediately: boolean = false,
) {
  const savedCallback = useRef<IntervalCallback>(async () => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (disabled) return;
    const actualDelay = Math.max(delay ?? 0, 100);

    let id: NodeJS.Timeout | number = 0;

    function tick() {
      return setTimeout(async function innerCallback() {
        await savedCallback.current();

        if (!disabled) {
          id = tick();
        }
      }, actualDelay);
    }

    async function invoke() {
      if (triggerImmediately) {
        await savedCallback.current();
      }
      id = tick();
    }

    invoke();
    return () => {
      if (id) {
        clearTimeout(id as number);
      }
    };
  }, [delay, disabled].concat(deps));
}
