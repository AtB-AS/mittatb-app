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
  ...a11yProps
}: {
  style: ViewStyle;
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

export {TouchableOpacityOrView};
