import {giveFocus} from '@atb/utils/use-focus-on-load';
import {useRef, useEffect} from 'react';
import {
  SnackbarTextContent,
  getSnackbarHasTextContent,
} from '@atb/components/snackbar';

export const useSnackbarScreenReaderFocus = (
  stableTextContent?: SnackbarTextContent,
) => {
  const focusRef = useRef(null);

  useEffect(() => {
    if (getSnackbarHasTextContent(stableTextContent)) {
      setTimeout(() => giveFocus(focusRef), 50);
    }
  }, [stableTextContent, focusRef]);

  return focusRef;
};
