import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {View} from 'react-native';
import {TextColor, ThemeColor} from '@atb/theme/colors';
import ThemeText from '../text';
import RadioIcon from './radio-icon';
import {TouchableOpacity} from 'react-native';
import {AccessibilityProps} from 'react-native';

type CheckedProps = {
  checked: boolean;
  color?: TextColor | ThemeColor;
  text: string;
  subText?: string;
  onPress?: () => void;
} & AccessibilityProps;

export default function RadioItem({
  checked,
  color,
  text,
  subText,
  onPress,
  accessibilityHint,
  accessibilityLabel,
}: CheckedProps) {
  const styles = useStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.radioItem}
      accessibilityHint={accessibilityHint}
      accessibilityRole="radio"
      accessibilityState={{selected: checked}}
      accessibilityLabel={text + ': ' + subText}
    >
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
