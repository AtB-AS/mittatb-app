import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {NativeBorderlessButton} from '@atb/components/native-button';

export const BorderlessButtonOrView = ({
  style,
  onClick,
  children,
  testID,
  focusRef,
  ...a11yProps
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  onClick?: () => void;
  testID?: string;
  focusRef?: React.Ref<any>;
} & AccessibilityProps) => {
  return onClick ? (
    <NativeBorderlessButton
      onPress={onClick}
      style={style}
      ref={focusRef}
      {...a11yProps}
      testID={testID ? testID : 'messageBox'}
    >
      {children}
    </NativeBorderlessButton>
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
