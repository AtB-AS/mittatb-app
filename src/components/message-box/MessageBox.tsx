import React from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Statuses, StyleSheet, useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {useTranslation} from '@atb/translations';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {screenReaderPause} from '@atb/components/accessible-text';
import {messageTypeToIcon} from '@atb/utils/message-type-to-icon';

export type MessageBoxProps = {
  type: Statuses;
  title?: string;
  message: string;
  noStatusIcon?: boolean;
  onDismiss?: () => void;
  onPress?: () => void;
  onPressText?: string;
  isMarkdown?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const MessageBox = ({
  noStatusIcon,
  type,
  style,
  message,
  title,
  isMarkdown = false,
  onPress,
  onPressText,
  onDismiss,
}: MessageBoxProps) => {
  const {theme} = useTheme();
  const styles = useStyles();
  const {t} = useTranslation();
  const textColor = theme.static.status[type].text;
  const colorStyle = {
    backgroundColor: theme.static.status[type].background,
  };
  return (
    <View style={[styles.container, colorStyle, style]}>
      {!noStatusIcon && (
        <ThemeIcon
          fill={textColor}
          style={styles.icon}
          svg={messageTypeToIcon(type)}
        />
      )}
      <View style={styles.content} accessible={true}>
        {title && (
          <ThemeText
            type="body__primary--bold"
            color={type}
            style={styles.title}
            accessibilityLabel={title + screenReaderPause}
          >
            {title}
          </ThemeText>
        )}
        <ThemeText color={type} isMarkdown={isMarkdown}>
          {message}
        </ThemeText>
        {onPress && (
          <ThemeText
            color={type}
            style={styles.onPressLink}
            type="body__primary--underline"
            onPress={onPress}
            accessibilityRole="link"
          >
            {onPressText ?? t(MessageBoxTexts.tryAgainButton)}
          </ThemeText>
        )}
      </View>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          accessible={true}
          accessibilityLabel={t(MessageBoxTexts.dismiss.allyLabel)}
          accessibilityHint={t(MessageBoxTexts.dismiss.allyHint)}
          accessibilityRole="button"
        >
          <ThemeIcon fill={textColor} svg={Close} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    flexDirection: 'row',
  },
  icon: {
    marginRight: theme.spacings.medium,
  },
  content: {
    flex: 1,
  },
  onPressLink: {
    marginTop: theme.spacings.medium,
  },
  title: {
    marginBottom: theme.spacings.small,
  },
}));
