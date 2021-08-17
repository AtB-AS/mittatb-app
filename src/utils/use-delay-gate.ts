import {useState, useEffect} from 'react';

/** Returns false at first, then true after a set time */
export default function useDelayGate(delayMs: number): boolean {
  const [gate, setGate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setGate(true);
    }, delayMs);
  });
  return gate;
}
