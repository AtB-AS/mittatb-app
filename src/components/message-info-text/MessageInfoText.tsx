import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Statuses, StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {ContrastColor, TextColor} from '@atb/theme/colors';

export type MessageInfoTextProps = {
  type: Statuses;
  message: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  iconPosition?: 'right' | 'left';
  textColor?: ContrastColor;
  isMarkdown?: boolean;
};

export const MessageInfoText = ({
  type,
  style,
  message,
  iconPosition = 'left',
  testID,
  textColor,
  isMarkdown = false,
}: MessageInfoTextProps) => {
  const styles = useStyles();
  const {themeName} = useTheme();

  const iconColorProps = {colorType: textColor};

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      testID={testID}
      accessibilityLabel={message}
    >
      {iconPosition === 'left' && (
        <ThemeIcon
          svg={messageTypeToIcon(type, true, themeName)}
          {...iconColorProps}
        />
      )}

      <ThemeText
        color={textColor}
        isMarkdown={isMarkdown}
        type="body__secondary"
        style={styles.text}
      >
        {message}
      </ThemeText>

      {iconPosition === 'right' && (
        <ThemeIcon
          svg={messageTypeToIcon(type, true, themeName)}
          {...iconColorProps}
        />
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  text: {
    flexShrink: 1,
  },
}));
