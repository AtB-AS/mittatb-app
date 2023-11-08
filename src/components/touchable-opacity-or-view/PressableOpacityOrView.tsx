import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export const PressableOpacityOrView = ({
  style,
  onClick,
  children,
  testID,
  ...a11yProps
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  onClick?: () => void;
  testID?: string;
} & AccessibilityProps) => {
  return onClick ? (
    <PressableOpacity
      onPress={onClick}
      style={style}
      {...a11yProps}
      testID={testID ? testID : 'messageBox'}
    >
      {children}
    </PressableOpacity>
  ) : (
    <View style={style} {...a11yProps} testID={testID ? testID : 'messageBox'}>
      {children}
    </View>
  );
};
