import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Statuses, StyleSheet, useThemeContext} from '@atb/theme';
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
  textColor?: ContrastColor | TextColor;
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
  const {themeName} = useThemeContext();

  const iconColorProps = {color: textColor};

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

      <View style={styles.text}>
        <ThemeText
          color={textColor}
          isMarkdown={isMarkdown}
          typography="body__secondary"
        >
          {message}
        </ThemeText>
      </View>

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
    flex: 1,
  },
}));
