import {useEffect, useState} from 'react';
import {
  getDebugServerOverrides,
  subscribeToDebugServerOverrides,
} from './debug-server-overrides-cache';
import type {DebugServerOverride} from './types';

export function useDebugServerOverrides(): DebugServerOverride[] {
  const [overrides, setOverrides] = useState(() => getDebugServerOverrides());
  useEffect(() => {
    return subscribeToDebugServerOverrides(() =>
      setOverrides(getDebugServerOverrides()),
    );
  }, []);
  return overrides;
}
