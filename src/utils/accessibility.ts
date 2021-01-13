import {AccessibilityProps} from 'react-native';

export const screenReaderHidden: AccessibilityProps = {
  importantForAccessibility: 'no-hide-descendants',
  accessibilityElementsHidden: true,
};
