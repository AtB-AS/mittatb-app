import {giveFocus} from '@atb/utils/use-focus-on-load';
import isEqual from 'lodash.isequal';
import {useRef, useEffect} from 'react';
import {InteractionManager} from 'react-native';
import {
  SnackbarTextContent,
  getSnackbarHasTextContent,
} from '@atb/components/snackbar';

export const useSnackbarScreenReaderFocus = (
  activeTextContent?: SnackbarTextContent,
  previousTextContent?: SnackbarTextContent,
) => {
  const focusRef = useRef(null);

  useEffect(() => {
    if (
      getSnackbarHasTextContent(activeTextContent) &&
      !isEqual(previousTextContent, activeTextContent)
    ) {
      InteractionManager.runAfterInteractions(() => {
        giveFocus(focusRef);
      });
    }
  }, [previousTextContent, activeTextContent, focusRef]);

  return focusRef;
};
