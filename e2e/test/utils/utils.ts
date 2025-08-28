/**
 * Parses a string to a boolean
 * @param str input string ('true' | 'false')
 */
export function parseBoolean(str: string | undefined | null) {
  if (str === 'true') return true;
  if (str === 'false') return false;
  return undefined;
}

/**
 * From number to string with prefill of '0'. E.g. 6 -> "06" with two chars
 * @param input number to convert
 * @param noChars how many chars the string should be
 */
export function numberToStringWithZeros(input: number, noChars: number = 2) {
  let toString: string = input.toString();
  while (toString.length < noChars) {
    toString = '0' + toString;
  }
  return toString;
}

/**
 * Converts a string to an array of numbers
 * @param inputString string to be separated into a number array
 * @param separator separator (default: ':')
 */
export function stringToNumArray(
  inputString: string,
  separator: string = ':',
): number[] {
  return inputString.split(separator).map((el) => parseInt(el));
}

/**
 * Format a phone number (e.g. 12345678 > 12 34 56 78)
 * @param raw phone number (8 digits), e.g. 12345678
 */
export function formatPhoneNumber(raw: string): string {
  const compressed = raw.replace(' ', '');
  return compressed.replace(/(\d{2})(?=\d)/g, '$1 ');
}
