import {useEffect} from 'react';
import {AccessibilityInfo} from 'react-native';

export const useScreenReaderAnnouncement = (
  message?: string,
  enabled: boolean = true,
) => {
  useEffect(() => {
    if (message && enabled) {
      setTimeout(
        () => AccessibilityInfo.announceForAccessibility(message),
        100,
      );
    }
  }, [message, enabled]);
};
