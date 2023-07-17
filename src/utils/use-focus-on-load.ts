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
 * The give focus is delayed by 200ms to allow the render to finish before
 * trying to give focus.
 */
export function useFocusOnLoad(setFocusOnLoad: boolean = true) {
  const focusRef = useRef(null);

  useEffect(() => {
    if (!setFocusOnLoad || !focusRef.current) return;

    giveFocus(focusRef);
  }, [focusRef.current, setFocusOnLoad]);

  const navigation = useNavigationSafe();
  useEffect(() => {
    if (!navigation || !focusRef.current || !setFocusOnLoad) return;

    const unsubscribe = navigation.addListener('focus', () =>
      giveFocus(focusRef),
    );
    return () => unsubscribe();
  }, [navigation, focusRef.current, setFocusOnLoad]);

  return focusRef;
}

export const giveFocus = (
  focusRef: React.MutableRefObject<any>,
  timeoutMilliseconds?: number,
) => {
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
