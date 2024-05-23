import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useState, useEffect, useRef} from 'react';
import {
  SnackbarTextContent,
  getSnackbarTextHasContent,
} from '@atb/components/snackbar';

export const useSnackbarIsVisible = (
  texts?: SnackbarTextContent,
  customVisibleDurationMS?: number,
) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const totalNumberOfTextCharacters =
    (texts?.title?.length || 0) + (texts?.description?.length || 0);

  const visibleDurationMS =
    customVisibleDurationMS ||
    Math.max(5000, totalNumberOfTextCharacters * 100);

  const snackbarHasTextToShow = getSnackbarTextHasContent(texts);

  const [isVisible, setIsVisible] = useState(snackbarHasTextToShow);

  const hideSnackbar = () => setIsVisible(false);

  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>();

  const clearCurrentTimeout = () =>
    timeoutIdRef.current && clearTimeout(timeoutIdRef.current);

  useEffect(() => {
    setIsVisible(snackbarHasTextToShow);
  }, [snackbarHasTextToShow]);

  useEffect(() => {
    clearCurrentTimeout();
    if (snackbarHasTextToShow) {
      setIsVisible(true);
      timeoutIdRef.current = setTimeout(() => {
        !isScreenReaderEnabled && hideSnackbar();
      }, visibleDurationMS);
    }
    return clearCurrentTimeout;
  }, [texts, visibleDurationMS, isScreenReaderEnabled, snackbarHasTextToShow]);

  return {isVisible, hideSnackbar};
};
