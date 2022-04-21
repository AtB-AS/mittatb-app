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
