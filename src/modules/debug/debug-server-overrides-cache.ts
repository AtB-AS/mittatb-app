import {storage} from '@atb/modules/storage';
import type {DebugServerOverride, HeaderOverride} from './types';

export type {DebugServerOverride} from './types';

let cachedOverrides: DebugServerOverride[] = [];

/**
 * Load debug server overrides from storage into the in-memory cache.
 * Should be called at app startup.
 */
export async function loadDebugServerOverrides(): Promise<void> {
  const raw = await storage.get('@ATB_debug_server_overrides');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedOverrides = parsed.map(
          (o: {
            match: string;
            newValue: string;
            headers?: HeaderOverride[];
          }) => ({
            ...o,
            match: new RegExp(o.match),
          }),
        );
        return;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to parse debug server overrides from storage', e);
    }
  }
  cachedOverrides = [];
}

/**
 * Update the in-memory cache directly. Use this when overrides are changed
 * at runtime to ensure the cache is immediately consistent.
 */
export function setDebugServerOverrides(
  overrides: DebugServerOverride[],
): void {
  cachedOverrides = overrides;
}

/**
 * Get the currently cached debug server overrides.
 */
export function getDebugServerOverrides(): DebugServerOverride[] {
  return cachedOverrides;
}
