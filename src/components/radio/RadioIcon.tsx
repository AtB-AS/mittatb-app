import React from 'react';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {
  isStaticColor,
  TextColor,
  StaticColor,
  getStaticColor,
} from '@atb/theme/colors';

type CheckedProps = {
  checked: boolean;
  color?: TextColor | StaticColor;
};

export function RadioIcon({checked, color = 'primary'}: CheckedProps) {
  const styles = useStyles();
  const {theme, themeName} = useTheme();

  const colorValue = isStaticColor(color)
    ? getStaticColor(themeName, color).text
    : theme.text.colors[color];

  return (
    <View style={[styles.radio, {borderColor: colorValue}]}>
      {checked ? (
        <View style={[styles.radioInner, {backgroundColor: colorValue}]} />
      ) : null}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  radio: {
    height: theme.spacings.large,
    width: theme.spacings.large,
    borderRadius: theme.spacings.large,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: theme.spacings.medium,
    width: theme.spacings.medium,
    borderRadius: theme.spacings.large,
  },
}));
