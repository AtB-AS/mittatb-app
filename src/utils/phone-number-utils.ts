import parsePhoneNumber from 'libphonenumber-js';

/**
 * Formats the phone number to the international standard. If the given phone
 * number could not be parsed or formatted, then the input phone number will
 * be returned unmodified.
 */
export const formatPhoneNumber = (raw: string): string =>
  parsePhoneNumber(raw)?.formatInternational() || raw;
