import {useState, useEffect} from 'react';

/**
 * Returns false at first, then true after a set time. If the hook is not
 * enabled it will always return true. If the hook changes from disabled to
 * enabled, the delay gate timer will restart.
 */
export function useDelayGate(
  delayMs: number,
  enabled: boolean = true,
): boolean {
  const [gate, setGate] = useState(false);

  useEffect(() => {
    setGate(false);
    if (enabled) {
      const id = setTimeout(() => {
        setGate(true);
      }, delayMs);
      return () => {
        clearInterval(id);
      };
    }
  }, [enabled]);

  return enabled ? gate : true;
}
