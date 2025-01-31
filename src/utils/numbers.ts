import {Language} from '@atb/translations';

export const formatFarePrice = (
  str: number,
  language: Language,
  fractionDigits?: number,
  isVat?: boolean /**Always show 2 decimals in VAT value*/,
) => {
  const minFractionDigits = isVat ? 2 : str % 1 == 0 ? 0 : 2;
  return str.toLocaleString(language, {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: fractionDigits || 2,
    useGrouping: false,
  });
};

export const formatDecimalNumber = (
  str: number,
  language: Language,
  fractionDigits?: number,
) => {
  const formatNumberRegexp = /(\d+)\.(\d{0,2})\d*/g;
  const decimalMark = language === Language.Norwegian ? ',' : '.';
  const formatNumberReplacement = `$1${decimalMark}$2`;
  const numberString = fractionDigits
    ? str.toFixed(fractionDigits)
    : str.toString();
  return numberString.replace(formatNumberRegexp, formatNumberReplacement);
};
