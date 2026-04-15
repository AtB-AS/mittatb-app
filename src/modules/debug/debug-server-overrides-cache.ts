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

/**
 * Apply debug server overrides to a URL. If a matching override is found, the
 * origin (scheme+host+port) of the URL is replaced with the override's
 * newValue while preserving the path and query string.
 *
 * When `forWebSocket` is true, `http://` and `https://` in the override value
 * are converted to `ws://` and `wss://` respectively, since overrides are
 * typically entered as HTTP URLs.
 *
 * Header overrides are not supported for WebSocket connections.
 */
export function applyDebugServerOverride(
  url: string,
  options?: {forWebSocket?: boolean},
): string {
  const overrides = getDebugServerOverrides();

  for (const override of overrides) {
    if (override.match.test(url)) {
      let newBaseUrl = override.newValue;
      if (options?.forWebSocket) {
        newBaseUrl = newBaseUrl
          .replace(/^http:\/\//, 'ws://')
          .replace(/^https:\/\//, 'wss://');
      }

      const urlObj = new URL(url);
      const pathAndQuery = urlObj.pathname + urlObj.search;
      return newBaseUrl.replace(/\/+$/, '') + pathAndQuery;
    }
  }

  return url;
}
