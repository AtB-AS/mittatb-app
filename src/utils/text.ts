/**
 * Uses a non-breaking space character (U+00A0) to prevent line breaks in the middle of
 * words you want to a new line.
 */
export const formatToNonBreakingSpaces = (raw: string): string =>
  raw.replaceAll(' ', ' ');

export const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
