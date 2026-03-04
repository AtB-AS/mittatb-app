import {
  StyleSheet as StyleSheetNative,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {Theme} from './colors';
import {useThemeContext} from './ThemeContext';
import {useSafeAreaInsets, EdgeInsets} from 'react-native-safe-area-context';

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export type ThemedStyles<T> = (theme: Theme, insets: EdgeInsets) => T;

type StyleSheetType = typeof StyleSheetNative;
interface ExtendedStyleSheet extends StyleSheetType {
  createThemeHook<T>(input: ThemedStyles<NamedStyles<T>>): () => NamedStyles<T>;
}

export function useStyle<T extends NamedStyles<T>>(
  style: ThemedStyles<T> | T,
): T {
  const {theme} = useThemeContext();
  const insets = useSafeAreaInsets();
  if (!isThemedStyles<T>(style)) {
    return style;
  }
  return style(theme, insets);
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
};
