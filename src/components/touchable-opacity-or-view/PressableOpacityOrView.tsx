import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export const PressableOpacityOrView = ({
  style,
  containerStyle,
  onClick,
  children,
  ...a11yProps
}: {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  onClick?: () => void;
} & AccessibilityProps) => {
  return onClick ? (
    <PressableOpacity
      onPress={onClick}
      containerStyle={containerStyle}
      style={style}
      {...a11yProps}
    >
      {children}
    </PressableOpacity>
  ) : (
    <View style={[containerStyle, style]} {...a11yProps}>
      {children}
    </View>
  );
};
