import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {Info, Warning} from '../assets/svg/icons/status';
import {StyleSheet} from '../theme';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';

type WithMessage = {message: string; children?: never};
type WithChildren = {
  message?: never;
  children: React.ReactNode;
};

export type MessageBoxProps = {
  icon?: React.ReactNode;
  type?: 'info' | 'warning';
  containerStyle?: StyleProp<ViewStyle>;
} & (WithMessage | WithChildren);

const MessageBox: React.FC<MessageBoxProps> = ({
  icon,
  type = 'info',
  containerStyle,
  message,
  children,
}) => {
  const styles = useBoxStyle();
  const iconElement =
    typeof icon !== 'undefined' ? (
      icon
    ) : (
      <ThemeIcon svg={type === 'info' ? Info : Warning} />
    );
  const child = message ? (
    <ThemeText style={styles.text}>{message}</ThemeText>
  ) : (
    children
  );
  const backgroundColor = styles[typeToColorClass(type)];
  return (
    <View style={[styles.container, backgroundColor, containerStyle]}>
      {iconElement != null && (
        <View style={styles.iconContainer}>{iconElement}</View>
      )}
      <View>{child}</View>
    </View>
  );
};

export default MessageBox;

const useBoxStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: 12,
    borderRadius: theme.border.borderRadius.regular,
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 8,
  },
  text: {
    ...theme.text.body,
    color: theme.text.colors.primary,
  },
  container__info: {
    backgroundColor: theme.background.info,
    borderColor: theme.border.info,
  },
  container__warning: {
    backgroundColor: theme.background.warning,
    borderColor: theme.border.warning,
  },
}));

function typeToColorClass(
  type: MessageBoxProps['type'],
): 'container__info' | 'container__warning' {
  switch (type) {
    case 'warning':
      return 'container__warning';
    default:
      return 'container__info';
  }
}
