import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {
  NativeBlockButton,
  NativeBorderlessButton,
} from '@atb/components/native-button';

export type NativeButtonType = 'borderless' | 'block';

export const NativeButtonOrView = ({
  type = 'borderless',
  style,
  onClick,
  children,
  testID,
  focusRef,
  ...a11yProps
}: {
  type?: NativeButtonType;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  onClick?: () => void;
  testID?: string;
  focusRef?: React.Ref<any>;
} & AccessibilityProps) => {
  const ButtonComponent =
    type === 'borderless' ? NativeBorderlessButton : NativeBlockButton;
  return onClick ? (
    <ButtonComponent
      onPress={onClick}
      style={style}
      ref={focusRef}
      {...a11yProps}
      testID={testID ? testID : 'messageBox'}
    >
      {children}
    </ButtonComponent>
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
