/**
 * Parses a string to a boolean
 * @param str input string ('true' | 'false')
 */
export function parseBoolean(str: string | undefined | null) {
  if (str === 'true') return true;
  if (str === 'false') return false;
  return undefined;
}
