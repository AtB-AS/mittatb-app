import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {View} from 'react-native';

type CheckedProps = {
  checked: boolean;
};

export function RadioIcon({checked}: CheckedProps) {
  const styles = useStyles();

  return (
    <View style={styles.radio}>
      {checked ? <View style={styles.radioInner} /> : null}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  radio: {
    height: theme.spacing.large,
    width: theme.spacing.large,
    borderRadius: theme.spacing.large,
    borderWidth: 2,
    borderColor: theme.color.surface.accent.strong.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: theme.spacing.medium,
    width: theme.spacing.medium,
    borderRadius: theme.spacing.large,
    backgroundColor: theme.color.surface.accent.strong.background,
  },
}));
