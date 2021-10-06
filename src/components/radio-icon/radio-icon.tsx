import React from 'react';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {isThemeColor, TextColor, ThemeColor} from '@atb/theme/colors';

type CheckedProps = {
  checked: boolean;
  color?: TextColor | ThemeColor;
};

export default function RadioIcon({checked, color = 'primary'}: CheckedProps) {
  const styles = useStyles();
  const {theme} = useTheme();

  const colorValue = isThemeColor(theme, color)
    ? theme.colors[color].color
    : theme.text.colors[color];

  return (
    <View style={[styles.radio, {borderColor: colorValue}]}>
      {checked ? (
        <View style={[styles.radioInnner, {backgroundColor: colorValue}]} />
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
  radioInnner: {
    height: theme.spacings.large - 8,
    width: theme.spacings.large - 8,
    borderRadius: theme.spacings.large,
  },
}));
