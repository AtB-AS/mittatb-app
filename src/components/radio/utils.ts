import {dictionary, type TranslateFunction} from '@atb/translations';
import {screenReaderPause} from '@atb/components/text';
import type {AccessibilityProps} from 'react-native';
import {Platform} from 'react-native';

/**
 * Get the accessibility props for a radio button. On iOS the accessibility role
 * radio doesn't work as it should, so we emulate the logic by using role button
 * and custom a11y label.
 *
 * https://github.com/facebook/react-native/issues/43266
 */
export const getRadioA11y = (
  label: string,
  selected: boolean,
  t: TranslateFunction,
  disabled: boolean = false,
): Pick<
  AccessibilityProps,
  'accessibilityLabel' | 'accessibilityRole' | 'accessibilityState'
> => {
  return Platform.OS === 'ios'
    ? {
        accessibilityRole: 'button',
        accessibilityLabel:
          label +
          screenReaderPause +
          t(selected ? dictionary.selected : dictionary.unselected),
        accessibilityState: {disabled},
      }
    : {
        accessibilityRole: 'radio',
        accessibilityLabel: label,
        accessibilityState: {selected, disabled},
      };
};
