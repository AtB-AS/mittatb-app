import {CreateReturn, ThemedStyles, NamedStyles} from './StyleSheet';
import {useTheme} from './ThemeContext';

import {Theme as ThemeM} from './colors';

export type Theme = ThemeM;
export {default as StyleSheet} from './StyleSheet';
export {useTheme} from './ThemeContext';

export function useStyle<T extends NamedStyles<T>>(style: CreateReturn<T>): T {
  const {theme} = useTheme();
  if (!isThemedStyles<T>(style)) {
    return style;
  }
  return style(theme);
}

function isThemedStyles<T>(style: any): style is ThemedStyles<T> {
  return typeof style === 'function';
}
