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

// MarginStyle is a subset of ViewStyle containing only margin-related
// fields, e.g. 'margin', 'marginTop', 'marginHorizontal', etc. All other
// ViewStyle fields are typed as `never`, so they cannot be set.
type MarginKeys = Extract<keyof ViewStyle, `margin${string}`>;
export type MarginStyle = Pick<ViewStyle, MarginKeys> & {
  [K in Exclude<keyof ViewStyle, MarginKeys>]?: never;
};

type StyleSheetType = typeof StyleSheetNative;
interface ExtendedStyleSheet extends StyleSheetType {
  createThemeHook<T extends NamedStyles<T>>(input: ThemedStyles<T>): () => T;
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
  createThemeHook<T extends NamedStyles<T>>(input: ThemedStyles<T>): () => T {
    return function useThemeStyle() {
      return useStyle(input);
    };
  },
};
