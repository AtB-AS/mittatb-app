import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {View} from 'react-native';

export function SectionSeparator() {
  const styles = useStyles();
  return <View style={styles.separator} />;
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.static.background.background_1.background,
  },
}));
