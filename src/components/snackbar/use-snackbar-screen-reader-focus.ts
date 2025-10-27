import {giveFocus} from '@atb/utils/use-focus-on-load';
import {useRef, useEffect} from 'react';
import {
  SnackbarContent,
  getSnackbarHasTextContent,
} from '@atb/components/snackbar';

export const useSnackbarScreenReaderFocus = (
  isDisabled: boolean,
  stableContent?: SnackbarContent,
) => {
  const focusRef = useRef(null);

  useEffect(() => {
    if (getSnackbarHasTextContent(stableContent) && !isDisabled) {
      setTimeout(() => giveFocus(focusRef), 50);
    }
  }, [stableContent, focusRef, isDisabled]);

  return focusRef;
};
