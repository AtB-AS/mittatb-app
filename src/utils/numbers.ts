import {Language} from '@atb/translations';

/*
Utility method for formatting a decimal number. Will use comma/dot based on
language, and a maximal of two decimals. Will not round the decimals.

When RN 0.65 is released, this can be replaced by the 'toLocaleString' method,
which as of now is not working on Android.
*/
export const formatDecimalNumber = (str: number, language: Language) => {
  const formatNumberRegexp = /(\d+)\.(\d{0,2})\d*/g;
  const decimalMark = language === Language.Norwegian ? ',' : '.';
  const formatNumberReplacement = `$1${decimalMark}$2`;
  return str.toString().replace(formatNumberRegexp, formatNumberReplacement);
};
