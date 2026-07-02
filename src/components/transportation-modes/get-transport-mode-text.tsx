import {
  dictionary,
  FareContractTexts,
  TranslateFunction,
} from '@atb/translations';
import {TransportModePair} from '@atb/components/icon-box';
import {capitalizeFirstLetter} from '@atb/utils/text';

const removeDuplicateStringsFilter = (
  val: string,
  i: number,
  arr: string[],
): boolean => arr.indexOf(val) === i;

/*
    Renders transportModes as natural text, e.g. "Buss og trikk"
 */
export const getTransportModeText = (
  modes: TransportModePair[],
  t: TranslateFunction,
): string => {
  if (!modes) return '';
  return modes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode, tm.subMode)))
    .filter(removeDuplicateStringsFilter)
    .map((str, i, arr) => {
      if (i === 0) {
        return capitalizeFirstLetter(str);
      } else if (i === arr.length - 1) {
        return ` ${t(dictionary.listConcatWord)} ${str}`;
      }
      return `, ${str}`;
    })
    .join('');
};
