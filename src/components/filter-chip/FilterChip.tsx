import React from 'react';
import {AccessibilityInfo, Platform, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {NativeTouchable} from '@atb/components/native-touchable';
import {dictionary, useTranslation} from '@atb/translations';

type Props = {
  text: string;
  selected: boolean;
  onPress: () => void;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export const FilterChip = ({
  text,
  selected,
  onPress,
  accessibilityHint,
  style,
  testID,
}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();

  const color = selected
    ? theme.color.surface.accent.subtle
    : theme.color.surface.neutral.subtle;

  return (
    <NativeTouchable
      variant="block"
      style={[styles.container, selected && styles.containerSelected, style]}
      onPress={() => {
        // Talkback doesn't read out the updated state automatically, so we
        // trigger it manually instead.
        if (Platform.OS === 'android' && !selected) {
          AccessibilityInfo.announceForAccessibility(t(dictionary.selected));
        }
        onPress();
      }}
      pressedColor={theme.color.surface.accent.subtlePressed.background}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{selected}}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <ThemeText color={color} typography="body__s__strong">
        {text}
      </ThemeText>
    </NativeTouchable>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    borderRadius: theme.border.radius.circle,
    padding: theme.spacing.medium,
    borderWidth: theme.border.width.slim,
    borderColor: 'transparent',
    backgroundColor: theme.color.surface.neutral.subtle.background,
    justifyContent: 'center',
  },
  containerSelected: {
    backgroundColor: theme.color.surface.accent.subtle.background,
    borderColor: theme.color.surface.accent.strong.background,
  },
}));
