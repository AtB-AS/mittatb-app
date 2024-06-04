import {giveFocus} from '@atb/utils/use-focus-on-load';
import {useRef, useEffect} from 'react';
import {
  SnackbarTextContent,
  getSnackbarHasTextContent,
} from '@atb/components/snackbar';

export const useSnackbarScreenReaderFocus = (
  isDisabled: boolean,
  stableTextContent?: SnackbarTextContent,
) => {
  const focusRef = useRef(null);

  useEffect(() => {
    if (getSnackbarHasTextContent(stableTextContent) && !isDisabled) {
      setTimeout(() => giveFocus(focusRef), 50);
    }
  }, [stableTextContent, focusRef, isDisabled]);

  return focusRef;
};
