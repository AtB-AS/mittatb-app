import {screenReaderPause, ThemeText} from '@atb/components/text';
import {StyleProp, ViewStyle} from 'react-native';
import {dictionary, useTranslation} from '@atb/translations';
import {Checkbox} from '.';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import type {ContrastColor} from '@atb-as/theme';
import {NativeBlockButton} from '../native-button';

export const CheckboxWithLabel = ({
  label,
  checked,
  onPress,
  color,
  style,
}: {
  label: string;
  checked: boolean;
  onPress: (v: boolean) => void;
  color: ContrastColor;
  style: StyleProp<ViewStyle>;
}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const a11yLabel =
    label +
    screenReaderPause +
    t(checked ? dictionary.checked : dictionary.unchecked);

  return (
    <NativeBlockButton
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={a11yLabel}
      onPress={() => onPress(!checked)}
    >
      <Checkbox checked={checked} />
      <ThemeText color={color}>{label}</ThemeText>
    </NativeBlockButton>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flexDirection: 'row', gap: theme.spacing.small},
}));
