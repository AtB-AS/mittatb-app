import {
  StyleSheet as StyleSheetNative,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {Theme} from './colors';

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export type ThemedStyles<T> = (theme: Theme) => T;

function createTheme<T extends NamedStyles<T>>(
  input: ThemedStyles<T>,
): ThemedStyles<T> {
  return (theme: Theme) => StyleSheetNative.create<T>(input(theme));
}

type StyleSheetType = typeof StyleSheetNative;
interface StyleSheet extends StyleSheetType {
  createTheme: typeof createTheme;
}

const StyleSheetImpl: StyleSheet = {
  ...StyleSheetNative,
  createTheme,
};

export default StyleSheetImpl;
