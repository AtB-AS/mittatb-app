import {
  StyleSheet as StyleSheetNative,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {Mode as ThemeMode, Theme} from './colors';
import {useThemeContext} from './ThemeContext';

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export type ThemedStyles<T> = (theme: Theme, themeName: ThemeMode) => T;

type StyleSheetType = typeof StyleSheetNative;
interface ExtendedStyleSheet extends StyleSheetType {
  createThemeHook<T>(input: ThemedStyles<NamedStyles<T>>): () => NamedStyles<T>;
  createTheme<T>(
    input: ThemedStyles<NamedStyles<T>>,
  ): ThemedStyles<NamedStyles<T>>;
}

export function useStyle<T extends NamedStyles<T>>(
  style: ThemedStyles<T> | T,
): T {
  const {theme, themeName} = useThemeContext();
  if (!isThemedStyles<T>(style)) {
    return style;
  }
  return style(theme, themeName);
}

function isThemedStyles<T>(style: any): style is ThemedStyles<T> {
  return typeof style === 'function';
}

export const StyleSheet: ExtendedStyleSheet = {
  ...StyleSheetNative,
  createThemeHook<T>(
    input: ThemedStyles<NamedStyles<T>>,
  ): () => NamedStyles<T> {
    return function useThemeStyle() {
      return useStyle(input);
    };
  },
  createTheme<T>(
    input: ThemedStyles<NamedStyles<T>>,
  ): ThemedStyles<NamedStyles<T>> {
    return (theme: Theme, themeName: ThemeMode) =>
      StyleSheetNative.create<NamedStyles<T>>(input(theme, themeName));
  },
};
