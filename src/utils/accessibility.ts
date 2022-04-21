import {AccessibilityProps} from 'react-native';
import {dictionary, TranslateFunction} from '@atb/translations';

export const screenReaderHidden: AccessibilityProps = {
  importantForAccessibility: 'no-hide-descendants',
  accessibilityElementsHidden: true,
};

export function numberToAccessibilityString(
  t: TranslateFunction,
  number: number,
): string {
  return [...(number + '')]
    .map((value) => {
      // Android TTS speaks 0 as "oh"!
      // This forces to speak number as words.
      switch (value) {
        case '0':
          return t(dictionary.numbers.zero);
        case '1':
          return t(dictionary.numbers.one);
        case '2':
          return t(dictionary.numbers.two);
        case '3':
          return t(dictionary.numbers.three);
        case '4':
          return t(dictionary.numbers.four);
        case '5':
          return t(dictionary.numbers.five);
        case '6':
          return t(dictionary.numbers.six);
        case '7':
          return t(dictionary.numbers.seven);
        case '8':
          return t(dictionary.numbers.eight);
        case '9':
          return t(dictionary.numbers.nine);
      }
    })
    .toString();
}
