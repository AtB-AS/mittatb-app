import {PropsWithChildren, useEffect} from 'react';
import {Platform, View, ViewProps} from 'react-native';
import SecureViewNativeComponent from './SecureViewNativeComponent';
import {NativeSecureFlag} from './NativeSecureFlag';

/**
 * View that wraps its children in a "secure text entry" canvas on iOS,
 * preventing them from being captured in screenshots or screen recordings. On
 * Android, it sets the window-level `FLAG_SECURE` while mounted, which blocks
 * screenshots and screen recordings of the whole screen.
 *
 * https://developer.android.com/reference/android/view/WindowManager.LayoutParams#FLAG_SECURE
 */
export function SecureView({children, ...props}: PropsWithChildren<ViewProps>) {
  if (Platform.OS === 'ios') {
    return (
      <SecureViewNativeComponent {...props}>
        {children}
      </SecureViewNativeComponent>
    );
  }
  return <AndroidSecureView {...props}>{children}</AndroidSecureView>;
}

function AndroidSecureView({children, ...props}: PropsWithChildren<ViewProps>) {
  // This is reference counted natively, so if several AndroidSecureView's are
  // mounted at once, the flag remains set until the last one unmounts.
  useEffect(() => {
    NativeSecureFlag.enableSecureFlag();
    return () => NativeSecureFlag.disableSecureFlag();
  }, []);

  return <View {...props}>{children}</View>;
}
