import React from 'react';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {isThemeColor, TextColor, ThemeColor} from '@atb/theme/colors';
import * as Sections from '@atb/components/sections';
import ThemeText from '../text';
import RadioIcon from '.';
import {TouchableOpacity} from 'react-native';

type CheckedProps = {
  checked: boolean;
  color?: TextColor | ThemeColor;
  text: string;
  subText?: string;
  onPress?: () => void;
};

export default function RadioItem({
  checked,
  color,
  text,
  subText,
  onPress,
}: CheckedProps) {
  const styles = useStyles();

  return (
    <TouchableOpacity onPress={onPress} style={styles.radioItem}>
      <View style={styles.icon}>
        <RadioIcon checked={checked} color={color || 'secondary_2'}></RadioIcon>
      </View>
      <View style={styles.content}>
        <ThemeText type="body__primary" color={color}>
          {text}
        </ThemeText>
        {subText && (
          <ThemeText type="body__tertiary" color={color}>
            {subText}
          </ThemeText>
        )}
      </View>
    </TouchableOpacity>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  radioItem: {
    flexDirection: 'row',
    marginTop: theme.spacings.medium,
  },
  icon: {
    marginRight: theme.spacings.medium,
  },
  content: {
    flex: 1,
  },
}));
