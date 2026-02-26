import {RefObject, useRef, useEffect} from 'react';
import {giveFocus} from './use-focus-on-load';
import {NativeButton} from '@atb/components/native-button';

export type FocusRefsType = {
  [key: string]: RefObject<typeof NativeButton>;
};

export function useFocusRefs(focusOnElementName: string | undefined) {
  const ref = useRef<FocusRefsType>(null);

  useEffect(
    () => giveFocus(ref.current?.[focusOnElementName + 'Ref' || '']),
    [focusOnElementName],
  );

  return ref;
}

/*

Example, how to use:

// in parent:
const focusRefs = useFocusRefs(params.onFocusElement);

// forward focusRefs to child
ref={focusRefs}

// in child, receive ref as type FocusRefsType
forwardRef<FocusRefsType, MyProps>(...)

// create new relevant refs in child
const fromHarborRef = useRef<NativeButton>(null);
const toHarborRef = useRef<NativeButton>(null);
<NativeButton ref={fromHarborRef} />
<NativeButton ref={toHarborRef} />

// make the new refs available to the ref in useFocusRefs
useImperativeHandle(ref, () => ({fromHarborRef, toHarborRef}));


// before pushing the route you are coming back from:
navigation.setParams({onFocusElement: undefined});

// when navigating back, set "onFocusElement" as param, e.g.
// onFocusElement: 'toHarbor'

*/
