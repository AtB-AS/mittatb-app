import {giveFocus} from '@atb/utils/use-focus-on-load';
import isEqual from 'lodash.isequal';
import {useRef, useEffect} from 'react';
import {InteractionManager} from 'react-native';
import {
  SnackbarTextContent,
  getSnackbarTextsHaveContent,
} from '@atb/components/snackbar';

export const useSnackbarScreenReaderFocus = (
  activeTexts?: SnackbarTextContent,
  previousTexts?: SnackbarTextContent,
) => {
  const focusRef = useRef(null);

  useEffect(() => {
    if (
      getSnackbarTextsHaveContent(activeTexts) &&
      !isEqual(previousTexts, activeTexts)
    ) {
      InteractionManager.runAfterInteractions(() => {
        giveFocus(focusRef);
      });
    }
  }, [previousTexts, activeTexts, focusRef]);

  return focusRef;
};
