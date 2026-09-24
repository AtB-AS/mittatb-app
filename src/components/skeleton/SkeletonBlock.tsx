import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';

/**
 * A single static placeholder shape. Compose these inside a `Skeleton` to build
 * richer skeletons — the enclosing `Skeleton` provides the shared shimmer.
 */
export const SkeletonBlock = ({style}: {style?: StyleProp<ViewStyle>}) => {
  const styles = useStyles();
  return <View style={[styles.base, style]} />;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  base: {
    backgroundColor: theme.color.background.neutral[3].background,
  },
}));
