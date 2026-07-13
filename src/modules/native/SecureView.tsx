import {PropsWithChildren} from 'react';
import {Platform, View, ViewProps} from 'react-native';
import SecureViewNativeComponent from './SecureViewNativeComponent';

/**
 * View that wraps its children in a "secure text entry" canvas on iOS,
 * preventing them from being captured in screenshots or screen recordings. On
 * Android, it behaves as a regular `View`.
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
