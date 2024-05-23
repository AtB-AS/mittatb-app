import {giveFocus} from '@atb/utils/use-focus-on-load';
import isEqual from 'lodash.isequal';
import {useRef, useEffect} from 'react';
import {
  SnackbarTextContent,
  getSnackbarTextHasContent,
} from '@atb/components/snackbar';

export const useSnackbarScreenReaderFocus = (
  activeTexts?: SnackbarTextContent,
  previousTexts?: SnackbarTextContent,
) => {
  const focusRef = useRef(null);
  const hasFocusedOnLoad = useRef(false);
  useEffect(() => {
    if (
      getSnackbarTextHasContent(activeTexts) &&
      (!isEqual(previousTexts, activeTexts) || !hasFocusedOnLoad.current)
    ) {
      hasFocusedOnLoad.current = true;
      giveFocus(focusRef);
    }
  }, [previousTexts, activeTexts]);
  return focusRef;
};
