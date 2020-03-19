import React from 'react';
import {View, Text, StyleProp, ViewStyle} from 'react-native';
import InfoIcon from './svg/InfoIcon';
import WarningIcon from './svg/WarningIcon';
import {StyleSheet} from '../theme';
import colors from '../theme/colors';

export type MessageBoxProps = {
  icon?: React.ReactNode;
  type?: 'info' | 'warning';
  containerStyle: StyleProp<ViewStyle>;
};

const MessageBox: React.FC<MessageBoxProps> = ({
  icon,
  type = 'info',
  children,
  containerStyle,
}) => {
  const styles = useBoxStyle();
  const iconElement = icon ?? type === 'info' ? <InfoIcon /> : <WarningIcon />;
  const child =
    typeof children === 'string' ? (
      <Text style={styles.text}>{children}</Text>
    ) : (
      children
    );
  const backgroundColor = typeToColor(type);

  return (
    <View style={[styles.container, {backgroundColor}, containerStyle]}>
      {iconElement}
      <View style={styles.childContainer}>{child}</View>
    </View>
  );
};

export default MessageBox;

const useBoxStyle = StyleSheet.createThemeHook(theme => ({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  childContainer: {
    marginLeft: 12,
  },
  text: {
    fontSize: 16,
  },
}));

function typeToColor(type: MessageBoxProps['type']) {
  switch (type) {
    case 'warning':
      return colors.secondary.orange;
    default:
      return colors.secondary.cyan;
  }
}
