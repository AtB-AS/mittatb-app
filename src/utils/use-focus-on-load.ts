import {useEffect, useRef} from 'react';
import {AccessibilityInfo, findNodeHandle} from 'react-native';
import {useNavigation} from '@react-navigation/native';

/**
 * Return a ref which can be set on a component to make it be focused by screen
 * reader when loaded on screen. This will work both on component mount, and
 * when the screen gets back in focus while already on the stack.
 */
export default function useFocusOnLoad(setFocusOnLoad: boolean = true) {
  const focusRef = useRef(null);
  useEffect(() => {
    giveFocus(focusRef, setFocusOnLoad);
  }, [setFocusOnLoad]);

  const navigation = useNavigationSafe();
  useEffect(
    () =>
      navigation?.addListener('focus', () => {
        setTimeout(() => giveFocus(focusRef, setFocusOnLoad), 200);
      }),
    [navigation, setFocusOnLoad],
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

export const giveFocus = (
  focusRef: React.MutableRefObject<any>,
  shouldFocus: boolean = true,
) => {
  if (shouldFocus && focusRef.current) {
    const reactTag = findNodeHandle(focusRef.current);
    if (reactTag) {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    }
  }
};
