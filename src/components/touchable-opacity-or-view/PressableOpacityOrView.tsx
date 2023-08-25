import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export const PressableOpacityOrView = ({
  style,
  onClick,
  children,
  ...a11yProps
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  onClick?: () => void;
} & AccessibilityProps) => {
  return onClick ? (
    <PressableOpacity onPress={onClick} style={style} {...a11yProps}>
      {children}
    </PressableOpacity>
  ) : (
    <View style={style} {...a11yProps}>
      {children}
    </View>
  );
};
