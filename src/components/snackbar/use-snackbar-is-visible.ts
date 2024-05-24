import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useState, useEffect, useRef} from 'react';
import {
  SnackbarTextContent,
  getSnackbarTextsHaveContent,
} from '@atb/components/snackbar';
import {snackbarAnimationDurationMS} from './use-snackbar-vertical-position-animation';

export const useSnackbarIsVisible = (
  texts?: SnackbarTextContent,
  customVisibleDurationMS?: number,
) => {
  const totalNumberOfTextCharacters =
    (texts?.title?.length || 0) + (texts?.description?.length || 0);

  const estimatedTimeRequiredToReadTextMS = totalNumberOfTextCharacters * 100; // 0.1 seconds per character
  const minimumVisibleTimeMS = 5000; // 5 seconds

  const visibleDurationMS = // number of milliseconds the Snackbar should stay in the visible position
    customVisibleDurationMS ||
    Math.max(minimumVisibleTimeMS, estimatedTimeRequiredToReadTextMS);

  const shouldShowSnackbar = getSnackbarTextsHaveContent(texts); // if there is new text to show, it should be shown

  const [isVisible, setIsVisible] = useState(shouldShowSnackbar);

  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>();
  const clearCurrentTimeout = () =>
    timeoutIdRef.current && clearTimeout(timeoutIdRef.current);

  useEffect(() => {
    setIsVisible(shouldShowSnackbar);
    if (shouldShowSnackbar) {
      clearCurrentTimeout(); // cancel the old timeout, preventing it from interfering with the new

      timeoutIdRef.current = setTimeout(
        () => !isScreenReaderEnabled && setIsVisible(false), // only auto-hide when the screen reader is off
        snackbarAnimationDurationMS + visibleDurationMS,
      ); // first wait for the animation to complete, then wait visibleDurationMS before hiding
    }
    return clearCurrentTimeout;
  }, [texts, visibleDurationMS, isScreenReaderEnabled, shouldShowSnackbar]);

  const hideSnackbar = () => setIsVisible(false);

  return {isVisible, hideSnackbar};
};
