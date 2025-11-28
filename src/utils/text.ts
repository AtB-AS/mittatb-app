/**
 * Uses a non-breaking space character (U+00A0) to prevent line breaks in the middle of
 * words you want to a new line.
 */
export const formatToNonBreakingSpaces = (raw: string): string =>
  raw.replaceAll(' ', ' ');
