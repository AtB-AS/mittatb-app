import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {NativeBlockButton} from '@atb/components/native-button';

export const PressableOpacityOrView = ({
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
    <NativeBlockButton
      onPress={onClick}
      style={style}
      ref={focusRef}
      {...a11yProps}
      testID={testID ? testID : 'messageBox'}
    >
      {children}
    </NativeBlockButton>
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
