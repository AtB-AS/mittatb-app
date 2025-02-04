import {AccessibilityProps} from 'react-native';

export const screenReaderHidden: AccessibilityProps = {
  importantForAccessibility: 'no-hide-descendants',
  accessibilityElementsHidden: true,
};

/**
 * Takes a number and split each digit separated by spaces
 * E.g. numberToAccessibilityString(12345) -> "1 2 3 4 5"
 * This is useful for accessibility tools read it easy instead of a number with thousands or millions on it.
 *
 * @param number
 * @returns string with number separated by space
 */
export function numberToAccessibilityString(number: number): string {
  return [...(number + '')].join(' ');
}

/**
 * Split each letter of a string with spaces. This is useful for screen readers
 * to spell out each digit instead of a big number with thousands or millions,
 * or IDs as letters instead of a trying to pronounce it as a word.
 *
 * @example spellOut("+47 123 41 234") -> "+ 4 7 1 2 3 4 1 2 3 4"
 */
export function spellOut(s: string): string {
  return s.replaceAll(' ', '').split('').join(' ');
}
