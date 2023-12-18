import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Statuses, StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';
import {PressableOpacityOrView} from '@atb/components/touchable-opacity-or-view';
import {StaticColor} from '@atb/theme/colors';

export type MessageInfoTextProps = {
  type: Statuses;
  message: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  iconSide?: 'right' | 'left';
  textColor?: StaticColor;
  isMarkdown?: boolean;
};

export const MessageInfoText = ({
  type,
  style,
  message,
  iconSide = 'left',
  testID,
  textColor,
  isMarkdown = false,
}: MessageInfoTextProps) => {
  const styles = useStyles();

  const iconColorProps = {colorType: textColor};

  return (
    <PressableOpacityOrView
      style={[styles.container, style]}
      accessible={true}
      testID={testID}
      accessibilityLabel={message}
    >
      {iconSide == 'left' && (
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

      {iconSide == 'right' && (
        <ThemeIcon svg={messageTypeToIcon(type, true)} {...iconColorProps} />
      )}
    </PressableOpacityOrView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacings.small,
  },
  text: {
    flex: 1,
  },
}));
