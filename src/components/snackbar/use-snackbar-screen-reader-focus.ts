import {isDefined} from '@atb/utils/presence';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import isEqual from 'lodash.isequal';
import {useRef, useEffect} from 'react';
import {SnackbarTextContent} from './Snackbar';

export const useSnackbarScreenReaderFocus = (
  activeTexts?: SnackbarTextContent,
  previousTexts?: SnackbarTextContent,
) => {
  const focusRef = useRef(null);
  const hasFocusedOnLoad = useRef(false);
  useEffect(() => {
    if (
      isDefined(activeTexts) &&
      (isDefined(activeTexts?.title) || isDefined(activeTexts.title)) &&
      (!isEqual(previousTexts, activeTexts) || !hasFocusedOnLoad.current)
    ) {
      hasFocusedOnLoad.current = true;
      giveFocus(focusRef);
    }
  }, [previousTexts, activeTexts]);
  return focusRef;
};
