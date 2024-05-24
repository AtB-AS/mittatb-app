import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useState, useEffect, useRef} from 'react';
import {
  SnackbarTextContent,
  getSnackbarHasTextContent,
} from '@atb/components/snackbar';
import {snackbarAnimationDurationMS} from './use-snackbar-vertical-position-animation';

export const useSnackbarIsVisible = (
  textContent?: SnackbarTextContent,
  customVisibleDurationMS?: number,
) => {
  const totalNumberOfTextCharacters =
    (textContent?.title?.length || 0) + (textContent?.description?.length || 0);

  const estimatedTimeRequiredToReadTextMS = totalNumberOfTextCharacters * 100; // 0.1 seconds per character
  const minimumVisibleTimeMS = 5000; // 5 seconds

  const visibleDurationMS = // number of milliseconds the Snackbar should stay in the visible position
    customVisibleDurationMS ||
    Math.max(minimumVisibleTimeMS, estimatedTimeRequiredToReadTextMS);

  const shouldShowSnackbar = getSnackbarHasTextContent(textContent); // if there is new textContent to show, it should be shown

  const [snackbarIsVisible, setSnackbarIsVisible] =
    useState(shouldShowSnackbar);

  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>();
  const clearCurrentTimeout = () =>
    timeoutIdRef.current && clearTimeout(timeoutIdRef.current);

  useEffect(() => {
    setSnackbarIsVisible(shouldShowSnackbar);
    if (shouldShowSnackbar) {
      clearCurrentTimeout(); // clear possibly existing current timeout, preventing it from interfering with the new

      timeoutIdRef.current = setTimeout(
        () => !isScreenReaderEnabled && setSnackbarIsVisible(false), // only auto-hide when the screen reader is off
        snackbarAnimationDurationMS + visibleDurationMS,
      ); // first wait for the animation to complete, then wait visibleDurationMS before hiding
    }
    return clearCurrentTimeout; // clear timeout when the component is unmounted
  }, [
    textContent,
    visibleDurationMS,
    isScreenReaderEnabled,
    shouldShowSnackbar,
  ]);

  const hideSnackbar = () => setSnackbarIsVisible(false);

  return {snackbarIsVisible, hideSnackbar};
};
