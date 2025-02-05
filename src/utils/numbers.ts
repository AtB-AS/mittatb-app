import {Language} from '@atb/translations';

/**
 * A utility function to format a number to a string with a given
 * number of decimals.
 *
 * By default, the min digits is 0 and max digits is 2. Some examples
 * of the default behaviour:
 * 10 => "10"
 * 10.1 => "10,10"
 * 10.125 => "10,13"
 * 10.999 => "11"
 *
 * Note: By default this function will avoid have one decimal in the
 * return string, unless overridden by specifying 1 digit as min or max
 * digits.
 *
 * Note 2: If the given max digits is lower than the given min digits,
 * then the max digits have priority.
 */
export const formatNumberToString = (
  num: number,
  language: Language,
  minDigits: number = 0,
  maxDigits: number = 2,
) => {
  const roundedNumber = Number(num.toFixed(maxDigits));
  const sanitizedMinDigits = minDigits === 0 ? 2 : minDigits;
  return minDigits === 0 && Number.isInteger(roundedNumber)
    ? roundedNumber.toLocaleString()
    : roundedNumber.toLocaleString(language, {
        minimumFractionDigits: Math.min(sanitizedMinDigits, maxDigits),
        maximumFractionDigits: maxDigits,
      });
};
