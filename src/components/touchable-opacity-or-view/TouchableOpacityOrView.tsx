import {
  AccessibilityProps,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ReactNode} from 'react';

export const TouchableOpacityOrView = ({
  style,
  onClick,
  children,
  ...a11yProps
}: {
  style: StyleProp<ViewStyle>;
  children: ReactNode;
  onClick?: () => void;
} & AccessibilityProps) => {
  return onClick ? (
    <TouchableOpacity onPress={onClick} style={style} {...a11yProps}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={style} {...a11yProps}>
      {children}
    </View>
  );
};
