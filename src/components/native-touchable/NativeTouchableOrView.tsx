import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {NativeTouchable, NativeTouchableVariant} from './NativeTouchable';

export const NativeTouchableOrView = ({
  variant,
  style,
  onClick,
  children,
  testID,
  focusRef,
  ...a11yProps
}: {
  variant: NativeTouchableVariant;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  onClick?: () => void;
  testID?: string;
  focusRef?: React.Ref<any>;
} & AccessibilityProps) => {
  return onClick ? (
    <NativeTouchable
      variant={variant}
      onPress={onClick}
      style={style}
      ref={focusRef}
      {...a11yProps}
      testID={testID ? testID : 'messageBox'}
    >
      {children}
    </NativeTouchable>
  ) : (
    <View
      style={style}
      ref={focusRef}
      {...a11yProps}
      testID={testID ? testID : 'messageBox'}
    >
      {children}
    </View>
  );
};
