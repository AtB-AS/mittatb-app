import parsePhoneNumber from 'libphonenumber-js';

/**
 * Formats the phone number to the international standard. If the given phone
 * number could not be parsed or formatted, then the input phone number will
 * be returned unmodified.
 */
export const formatPhoneNumber = (raw: string): string =>
  parsePhoneNumber(raw)?.formatInternational() || raw;

/**
 * Separates a phone number into prefix and number.
 * Uses parsePhoneNumber internally.
 * Returns raw phone number and prefix as undefined if number could not be parsed
 * @param {string| undefined} raw phone number string
 */
export const getParsedPrefixAndPhoneNumber = (
  raw: string | undefined,
): {
  prefix: string | undefined;
  phoneNumber: string | undefined;
} => {
  const parsedPhone = raw && parsePhoneNumber(raw);

  if (!parsedPhone) {
    return {
      prefix: undefined,
      phoneNumber: raw,
    };
  }

  return {
    prefix: parsedPhone.countryCallingCode,
    phoneNumber: parsedPhone.nationalNumber,
  };
};
