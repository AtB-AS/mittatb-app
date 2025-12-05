import React, {Ref, RefCallback, useCallback, useEffect, useRef} from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  InteractionManager,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

/**
 * Return a ref which can be set on a component to make it be focused by screen
 * reader when loaded on screen. This will work both on component mount, and
 * when the screen gets back in focus while already on the stack.
 *
 * In some cases, like in a stack, it is necessary to use a timeout to let the
 * screen render complete before giving focus.
 */
export function useFocusOnLoad(setFocusOnLoad: boolean = true): Ref<any> {
  const focusRef = useRef(null);
  const navigation = useNavigationSafe();

  const focusCallbackRef: RefCallback<any> = useCallback(
    (node) => {
      focusRef.current = node;
      if (setFocusOnLoad) giveFocus(focusRef);
    },
    [setFocusOnLoad],
  );

  useEffect(() => {
    if (!navigation || !focusRef || !setFocusOnLoad) return;

    const unsubscribe = navigation.addListener('focus', () =>
      giveFocus(focusRef),
    );
    return () => unsubscribe();
  }, [navigation, setFocusOnLoad]);

  return focusCallbackRef;
}

const useNavigationSafe = () => {
  try {
    return useNavigation();
  } catch {
    /*
    Navigation is not available as the current context is not inside a screen in
    a navigator
     */
    console.error(
      'Navigation is not available as the current context is not inside a screen in a navigator',
    );
    return undefined;
  }
};

export const giveFocus = (
  focusRef?: React.RefObject<any> | null | undefined,
) => {
  if (focusRef && focusRef.current) {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        const reactTag = findNodeHandle(focusRef?.current);
        reactTag && AccessibilityInfo.setAccessibilityFocus(reactTag);
      }, 100);
    });
  }
};
