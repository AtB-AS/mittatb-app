import {Language} from '@atb/translations';

/*
Utility method for formatting a decimal number. Will use comma/dot based on
language, and a maximal of two decimals. Will not round the decimals. The
fraction digits count will be fixed if parameter fractionDigits is provided.

When RN 0.65 is released, this can be replaced by the 'toLocaleString' method,
which as of now is not working on Android.
*/

export const formatDecimalNumber = (
  str: number,
  language: Language,
  fractionDigits?: number,
) => {
  const minFractionDigits = str % 1 == 0 ? 0 : 2;
  return str.toLocaleString(language, {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: false,
  });
};
