import React from 'react';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {View} from 'react-native';
import { ContrastColor } from '@atb-as/theme';

type CheckedProps = {
  checked: boolean;
  color: ContrastColor;
};

export function RadioIcon({checked, color }: CheckedProps) {
  const styles = useStyles();
 
  return (
    <View style={[styles.radio, {borderColor: color.background}]}>
      {checked ? (
        <View style={[styles.radioInner, {backgroundColor: color.background}]} />
      ) : null}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  radio: {
    height: theme.spacing.large,
    width: theme.spacing.large,
    borderRadius: theme.spacing.large,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: theme.spacing.medium,
    width: theme.spacing.medium,
    borderRadius: theme.spacing.large,
  },
}));
