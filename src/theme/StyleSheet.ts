import {StyleSheet, ViewStyle, TextStyle, ImageStyle} from 'react-native';
import {Theme} from './colors';

export type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};
export type ThemedStyles<T> = (theme: Theme) => T;
export type CreateReturn<T> = T | ThemedStyles<T>;

interface StyleSheet extends Omit<typeof StyleSheet, 'create'> {
  create<T extends NamedStyles<T>>(themeFn: ThemedStyles<T>): ThemedStyles<T>;
  create<T extends NamedStyles<T>>(input: T): T;
}

const StyleSheetImpl: StyleSheet = {
  ...StyleSheet,
  create<T extends NamedStyles<T>>(
    input: ThemedStyles<T> | T,
  ): CreateReturn<T> {
    if (!isThemedStyle(input)) {
      return StyleSheet.create<T>(input);
    }
    return (theme: Theme) => StyleSheet.create<T>(input(theme));
  },
};

function isThemedStyle<T>(input: any): input is ThemedStyles<T> {
  return typeof input === 'function';
}

export default StyleSheetImpl;
