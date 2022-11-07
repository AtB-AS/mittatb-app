import {
  AccessibilityProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ReactNode} from 'react';

const TouchableOpacityOrView = ({
  style,
  onClick,
  children,
  accessibilityProps,
}: {
  style: ViewStyle;
  children: ReactNode;
  onClick?: () => void;
  accessibilityProps?: AccessibilityProps;
}) => {
  return onClick ? (
    <TouchableOpacity
      onPress={onClick}
      style={style}
      accessibilityLabel={accessibilityProps?.accessibilityLabel}
      accessibilityHint={accessibilityProps?.accessibilityHint}
    >
      {children}
    </TouchableOpacity>
  ) : (
    <View
      style={style}
      accessibilityLabel={accessibilityProps?.accessibilityLabel}
      accessibilityHint={accessibilityProps?.accessibilityHint}
    >
      {children}
    </View>
  );
};

export {TouchableOpacityOrView};
