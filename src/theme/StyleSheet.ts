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

type StyleSheetType = typeof StyleSheetNative;
interface StyleSheet extends StyleSheetType {
  createTheme<T>(
    input: ThemedStyles<NamedStyles<T>>,
  ): ThemedStyles<NamedStyles<T>>;
}

const StyleSheetImpl: StyleSheet = {
  ...StyleSheetNative,
  createTheme<T>(
    input: ThemedStyles<NamedStyles<T>>,
  ): ThemedStyles<NamedStyles<T>> {
    return (theme: Theme) =>
      StyleSheetNative.create<NamedStyles<T>>(input(theme));
  },
};

export default StyleSheetImpl;
