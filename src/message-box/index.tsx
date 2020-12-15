import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {
  Check,
  Error as ErrorIcon,
  Info,
  Warning,
} from '../assets/svg/icons/status';
import {StyleSheet} from '../theme';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';
import hexToRgba from 'hex-to-rgba';

type WithMessage = {message: string; children?: never};
type WithChildren = {
  message?: never;
  children: React.ReactNode;
};
export type MessageType = 'info' | 'warning' | 'error' | 'success';
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
}) => {
  const styles = useBoxStyle();
  const iconElement =
    typeof icon !== 'undefined' ? icon : <ThemeIcon svg={typeToIcon(type)} />;
  const child = message ? (
    <ThemeText style={styles.text}>{message}</ThemeText>
  ) : (
    children
  );
  const backgroundColor = styles[typeToColorClass(type)];
  const paddedStyle = withMargin ? styles.container__padded : undefined;
  return (
    <View
      style={[styles.container, paddedStyle, backgroundColor, containerStyle]}
    >
      <View style={styles.titleContainer}>
        {iconElement != null && (
          <View style={styles.iconContainer}>{iconElement}</View>
        )}
        {title && <ThemeText style={styles.title}>{title}</ThemeText>}
      </View>
      <View>{child}</View>
    </View>
  );
};
type TinyMessageProps = {type?: MessageType} & (WithChildren | WithMessage);
export const TinyMessageBox: React.FC<TinyMessageProps> = ({
  type = 'info',
  message,
  children,
}) => {
  const styles = useBoxStyle();
  const backgroundColor = styles[typeToColorClass(type)];
  return (
    <View style={[styles.container, backgroundColor]}>
      {message ? (
        <ThemeText style={styles.text}>{message}</ThemeText>
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
    borderWidth: theme.border.width.slim,
  },
  container__padded: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  iconContainer: {
    marginBottom: 8,
    marginRight: 12,
  },
  text: {
    ...theme.text.body,
    color: theme.text.colors.primary,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  container__info: {
    backgroundColor: theme.background.info,
    borderColor: theme.border.info,
  },
  container__warning: {
    backgroundColor: theme.background.warning,
    borderColor: theme.border.warning,
  },
  container__error: {
    backgroundColor: hexToRgba(theme.background.error, 0.5),
    borderColor: theme.border.error,
  },
  container__success: {
    backgroundColor: theme.background.success,
    borderColor: theme.border.success,
  },
}));

function typeToIcon(type: MessageBoxProps['type']) {
  switch (type) {
    case 'warning':
      return Warning;
    case 'error':
      return ErrorIcon;
    case 'success':
      return Check;
    default:
      return Info;
  }
}

function typeToColorClass(
  type: MessageBoxProps['type'],
):
  | 'container__info'
  | 'container__warning'
  | 'container__error'
  | 'container__success' {
  switch (type) {
    case 'warning':
      return 'container__warning';
    case 'error':
      return 'container__error';
    case 'success':
      return 'container__success';
    default:
      return 'container__info';
  }
}
