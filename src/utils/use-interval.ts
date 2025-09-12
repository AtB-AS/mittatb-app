import React, {useRef, useEffect} from 'react';

type IntervalCallback = () => Promise<void> | void;

/***
 * Periodically execute a callback every N milliseconds.
 * Does not guarantee precision in interval if execution time of the callback is higher than delay.
 * Should not be used for animations or timers where precision is needed.
 *
 * If callback returns a promise execution for each interval awaits fulfilled promise.
 */
export function useInterval(
  callback: IntervalCallback,
  deps: React.DependencyList,
  delay: number,
  disabled: boolean = false,
  triggerImmediately: boolean = false,
) {
  const savedCallback = useRef<IntervalCallback>(async () => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(
    () => {
      if (disabled) return;
      const actualDelay = Math.max(delay ?? 0, 100);

      let id: NodeJS.Timeout | number = 0;

      function tick() {
        // Uses recursive setTimout loop instead of setInterval to prevent filling the message queue with
        // executions when execution of callback takes longer than the interval specified.
        // This means that we won't guarantee any specific execution time, but this is in liue with the intention of this function in any case.
        // See example https://developer.mozilla.org/en-US/docs/Web/API/setInterval#ensure_that_execution_duration_is_shorter_than_interval_frequency
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
      // Concatenation of deps can't be statically checked, so disabling rule here
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps.concat(delay, disabled, triggerImmediately),
  );
}
