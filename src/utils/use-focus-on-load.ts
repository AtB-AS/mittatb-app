import React, {useEffect, useRef} from 'react';
import {
  AccessibilityInfo,
  InteractionManager,
  findNodeHandle,
} from 'react-native';
import {useNavigationSafe} from '@atb/utils/use-navigation-safe';

/**
 * Return a ref which can be set on a component to make it be focused by screen
 * reader when loaded on screen. This will work both on component mount, and
 * when the screen gets back in focus while already on the stack.
 *
 * In some cases, like in a stack, it is necessary to use a timeout to let the screen render completely before giving
 * focus.
 */
export function useFocusOnLoad(
  setFocusOnLoad: boolean = true,
  timeOutMilliseconds?: number,
) {
  const focusRef = useRef(null);

  const navigation = useNavigationSafe();
  useEffect(() => {
    if (!navigation || !focusRef.current || !setFocusOnLoad) return;

    const unsubscribe = navigation.addListener('focus', () =>
      giveFocus(focusRef, timeOutMilliseconds),
    );
    return () => unsubscribe();
  }, [navigation, focusRef.current, setFocusOnLoad]);

  return focusRef;
}

export const giveFocus = (
  focusRef: React.RefObject<any> | null | undefined,
  timeoutMilliseconds?: number,
) => {
  if (focusRef === null || focusRef === undefined) {
    return;
  }
  if (focusRef.current) {
    InteractionManager.runAfterInteractions(() => {
      const setFocus = () => {
        const reactTag = findNodeHandle(focusRef.current);
        reactTag && AccessibilityInfo.setAccessibilityFocus(reactTag);
      };
      if (timeoutMilliseconds) {
        setTimeout(setFocus, timeoutMilliseconds);
      } else {
        setFocus();
      }
    });
  }
};
