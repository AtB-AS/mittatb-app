import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {Statuses, StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {StaticColor, TextColor} from '@atb/theme/colors';

export type MessageInfoTextProps = {
  type: Statuses;
  message: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  iconPosition?: 'right' | 'left';
  textColor?: StaticColor | TextColor;
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

  const iconColorProps = {colorType: textColor};

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      testID={testID}
      accessibilityLabel={message}
    >
      {iconPosition === 'left' && (
        <ThemeIcon svg={messageTypeToIcon(type, true)} {...iconColorProps} />
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
        <ThemeIcon svg={messageTypeToIcon(type, true)} {...iconColorProps} />
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacings.small,
  },
  text: {
    flexShrink: 1,
  },
}));
