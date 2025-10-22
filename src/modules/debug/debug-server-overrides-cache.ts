import {storage} from '@atb/modules/storage';

type HeaderOverride = {
  key: string;
  value: string;
};

export type DebugServerOverride = {
  match: RegExp;
  newValue: string;
  headers?: HeaderOverride[];
};

let cachedOverrides: DebugServerOverride[] = [];

/**
 * Load debug server overrides from storage into the in-memory cache.
 * Should be called at app startup and whenever overrides are changed.
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
      console.warn('Failed to parse debug server overrides from storage', e);
    }
  }
  cachedOverrides = [];
}

/**
 * Get the currently cached debug server overrides.
 */
export function getDebugServerOverrides(): DebugServerOverride[] {
  return cachedOverrides;
}
