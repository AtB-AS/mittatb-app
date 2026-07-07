import {PropsWithChildren} from 'react';
import {Platform, View, ViewProps} from 'react-native';
import SecureViewNativeComponent from './SecureViewNativeComponent';

/**
 * Hides its children from iOS screenshots and screen recordings while keeping
 * them visible on screen. On iOS the children are mounted inside a native
 * `secureTextEntry` canvas; on all other platforms this is a passthrough
 * `View`, so the content is rendered normally with no capture protection.
 */
export function SecureView({children, ...props}: PropsWithChildren<ViewProps>) {
  if (Platform.OS === 'ios') {
    return (
      <SecureViewNativeComponent {...props}>
        {children}
      </SecureViewNativeComponent>
    );
  }
  return <View {...props}>{children}</View>;
}
