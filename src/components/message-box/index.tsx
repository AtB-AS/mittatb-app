import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {
  Check,
  Error as ErrorIcon,
  Info,
  Warning,
} from '../../assets/svg/mono-icons/status';
import {StyleSheet, useTheme, Statuses} from '@atb/theme';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {useTranslation} from '@atb/translations';

type WithMessage = {
  message: string;
  onPress?: () => void;
  onPressText?: string;
  isMarkdown?: boolean;
  children?: never;
};
type WithChildren = {
  message?: never;
  onPress?: never;
  onPressText?: string;
  isMarkdown?: never;
  children: React.ReactNode;
};
export type MessageType = Statuses;
export type MessageBoxProps = {
  icon?: React.ReactNode;
  type?: MessageType;
  containerStyle?: StyleProp<ViewStyle>;
  title?: string;
  withMargin?: boolean;
} & (WithMessage | WithChildren);

const MessageBox: React.FC<MessageBoxProps> = ({
  icon,
  type = 'info',
  containerStyle,
  message,
  children,
  title,
  withMargin = false,
  isMarkdown = false,
  onPress,
  onPressText,
}) => {
  const {theme} = useTheme();
  const styles = useBoxStyle();
  const {t} = useTranslation();
  const textColor = theme.static.status[type].text;
  const iconElement =
    typeof icon !== 'undefined' ? (
      icon
    ) : (
      <ThemeIcon fill={textColor} svg={typeToIcon(type)} />
    );
  const child = message ? (
    <>
      <ThemeText
        style={{...styles.text, color: textColor}}
        isMarkdown={isMarkdown}
      >
        {message}
      </ThemeText>
      {onPress && (
        <ThemeText
          style={[styles.retryText, {color: textColor}]}
          type="body__primary--underline"
          onPress={onPress}
          accessibilityRole="link"
        >
          {onPressText ?? t(MessageBoxTexts.tryAgainButton)}
        </ThemeText>
      )}
    </>
  ) : (
    children
  );
  const colorStyle = {
    backgroundColor: theme.static.status[type].background,
  };
  const paddedStyle = withMargin ? styles.container__padded : undefined;
  return (
    <View style={[styles.container, paddedStyle, colorStyle, containerStyle]}>
      <View style={styles.titleContainer}>
        {iconElement != null && (
          <View style={styles.iconContainer}>{iconElement}</View>
        )}
      </View>
      <View style={styles.content}>
        {title && (
          <ThemeText
            type="body__primary--bold"
            style={{...styles.title, color: textColor}}
          >
            {title}
          </ThemeText>
        )}
        <View>{child}</View>
      </View>
    </View>
  );
};
type TinyMessageProps = {type?: MessageType} & (WithChildren | WithMessage);
export const TinyMessageBox: React.FC<TinyMessageProps> = ({
  type = 'info',
  message,
  children,
}) => {
  const {theme} = useTheme();
  const styles = useBoxStyle();
  const colorStyle = {
    color: theme.static.status[type].text,
    backgroundColor: theme.static.status[type].background,
  };
  return (
    <View style={[styles.container, colorStyle]}>
      {message ? (
        <ThemeText style={{...styles.text, color: colorStyle.color}}>
          {message}
        </ThemeText>
      ) : (
        {children}
      )}
    </View>
  );
};

export default MessageBox;

const useBoxStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    flexDirection: 'row',
  },
  container__padded: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  iconContainer: {
    marginRight: theme.spacings.medium,
  },
  content: {
    flex: 1,
  },
  text: theme.typography.body__primary,
  retryText: {
    marginTop: theme.spacings.medium,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    marginBottom: theme.spacings.small,
  },
}));

function typeToIcon(type: MessageBoxProps['type']) {
  switch (type) {
    case 'warning':
      return Warning;
    case 'error':
      return ErrorIcon;
    case 'valid':
      return Check;
    default:
      return Info;
  }
}
