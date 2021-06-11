import {useEffect, useRef} from 'react';
import {AccessibilityInfo, findNodeHandle, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

/**
 * Return a ref which can be set on a component to make it be focused by screen
 * reader when loaded on screen. This will work both on component mount, and
 * when the screen gets back in focus while already on the stack.
 */
export default function useFocusOnLoad(setFocusOnLoad: boolean = true) {
  const focusRef = useRef(null);
  useEffect(() => {
    giveFocus(setFocusOnLoad, focusRef);
  }, [focusRef.current, setFocusOnLoad]);

  const navigation = useNavigationSafe();
  useEffect(
    () =>
      navigation?.addListener('focus', () => {
        // 50 ms timeout necessary for iPhone VoiceOver
        // 150 ms timeout necessary for Android Talk back
        const a11yFocusTimeout = Platform.OS == 'ios' ? 50 : 150;
        setTimeout(() => giveFocus(setFocusOnLoad, focusRef), a11yFocusTimeout);
      }),
    [navigation, focusRef.current, setFocusOnLoad],
  );

  return focusRef;
}

const useNavigationSafe = () => {
  try {
    return useNavigation();
  } catch (ex) {
    /*
    Navigation is not available as the current context is not inside a screen in
    a navigator
     */
    return undefined;
  }
};

const giveFocus = (
  shouldFocus: boolean,
  focusRef: React.MutableRefObject<any>,
) => {
  if (shouldFocus && focusRef.current) {
    const reactTag = findNodeHandle(focusRef.current);
    if (reactTag) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  }
};
