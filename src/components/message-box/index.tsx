import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {
  Check,
  Error as ErrorIcon,
  Info,
  Warning,
} from '../../assets/svg/icons/status';
import {StyleSheet, useTheme, Statuses} from '@atb/theme';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {useTranslation} from '@atb/translations';

type WithMessage = {
  message: string;
  retryFunction?: () => void;
  children?: never;
};
type WithChildren = {
  message?: never;
  retryFunction?: never;
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
  retryFunction,
}) => {
  const {theme} = useTheme();
  const styles = useBoxStyle();
  const {t} = useTranslation();
  const textColor = theme.status[type].main.color;
  const iconElement =
    typeof icon !== 'undefined' ? (
      icon
    ) : (
      <ThemeIcon fill={textColor} svg={typeToIcon(type)} />
    );
  const child = message ? (
    <>
      <ThemeText style={{...styles.text, color: textColor}}>
        {message}
      </ThemeText>
      {retryFunction && (
        <ThemeText
          style={styles.retryText}
          type="body__link"
          onPress={retryFunction}
        >
          {t(MessageBoxTexts.tryAgainButton)}
        </ThemeText>
      )}
    </>
  ) : (
    children
  );
  const colorStyle = {
    backgroundColor: theme.status[type].main.backgroundColor,
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
          <ThemeText style={{...styles.title, color: textColor}}>
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
    ...theme.status[type].main,
  };
  return (
    <View style={[styles.container, colorStyle]}>
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
  text: theme.text.body,
  retryText: {
    marginTop: theme.spacings.medium,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
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
