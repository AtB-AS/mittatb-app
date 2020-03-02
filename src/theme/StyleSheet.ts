import {
  StyleSheet as StyleSheetNative,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {Theme} from './colors';
import {useTheme} from './ThemeContext';

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export type ThemedStyles<T> = (theme: Theme) => T;

type StyleSheetType = typeof StyleSheetNative;
interface StyleSheet extends StyleSheetType {
  createThemeHook<T>(input: ThemedStyles<NamedStyles<T>>): () => NamedStyles<T>;
  createTheme<T>(
    input: ThemedStyles<NamedStyles<T>>,
  ): ThemedStyles<NamedStyles<T>>;
}

export function useStyle<T extends NamedStyles<T>>(
  style: ThemedStyles<T> | T,
): T {
  const {theme} = useTheme();
  if (!isThemedStyles<T>(style)) {
    return style;
  }
  return style(theme);
}

function isThemedStyles<T>(style: any): style is ThemedStyles<T> {
  return typeof style === 'function';
}

const StyleSheetImpl: StyleSheet = {
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
    return (theme: Theme) =>
      StyleSheetNative.create<NamedStyles<T>>(input(theme));
  },
};

export default StyleSheetImpl;
