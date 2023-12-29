import {Ref, RefCallback, useCallback, useEffect, useRef} from 'react';
import {AccessibilityInfo, findNodeHandle, InteractionManager,} from 'react-native';
import {useNavigationSafe} from '@atb/utils/use-navigation-safe';

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
      if (setFocusOnLoad) giveFocus(node);
      focusRef.current = node;
    },
    [setFocusOnLoad],
  );

  useEffect(() => {
    if (!navigation || !focusRef.current || !setFocusOnLoad) return;

    const unsubscribe = navigation.addListener('focus', () =>
      giveFocus(focusRef.current),
    );
    return () => unsubscribe();
  }, [navigation, setFocusOnLoad]);

  return focusCallbackRef;
}

export const giveFocus = (node: any) => {
  if (node) {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        const reactTag = node && findNodeHandle(node);
        reactTag && AccessibilityInfo.setAccessibilityFocus(reactTag);
      }, 100);
    });
  }
};
