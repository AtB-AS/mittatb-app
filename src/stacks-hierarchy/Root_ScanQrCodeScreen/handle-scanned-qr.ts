import {CompiledKnownQrCodeUrl} from '@atb/modules/configuration';

const MAX_URL_LENGTH_FOR_MATCHING = 2048;
const HAS_SCHEME_REGEX = /^[a-z][a-z0-9+.\-]*:\/\//i;

/**
 * Prepends `https://` if the URL has no scheme. Used before handing a
 * matched known URL to the in-app browser or OS URL opener, since those
 * require a full URL.
 */
export function normalizeUrlForOpening(url: string): string {
  return HAS_SCHEME_REGEX.test(url) ? url : `https://${url}`;
}

/**
 * Returns true if the URL is a deep link for the current app build's scheme.
 * Case-insensitive on the scheme part.
 */
export function isAppDeepLink(url: string, appScheme: string): boolean {
  if (!appScheme) return false;
  const prefix = `${appScheme}://`;
  return url.toLowerCase().startsWith(prefix.toLowerCase());
}

/**
 * Returns the first known URL entry whose regex matches the scanned URL,
 * or undefined if none match. Caps the URL to 2048 chars before matching
 * to avoid pathological regex input.
 */
export function matchKnownUrl(
  url: string,
  entries: CompiledKnownQrCodeUrl[],
): CompiledKnownQrCodeUrl | undefined {
  const capped = url.slice(0, MAX_URL_LENGTH_FOR_MATCHING);
  return entries.find((entry) => entry.regex.test(capped));
}
