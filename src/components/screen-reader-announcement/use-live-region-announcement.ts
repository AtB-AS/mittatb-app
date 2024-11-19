import {useEffect} from 'react';
import {AccessibilityInfo, AccessibilityProps, Platform} from 'react-native';

/**
 * When a11yLabel changes, announce it to screen readers without interrupting
 * ongoing speach. Returns accessibility props that should be added to the
 * relevant component. For non-interactive components, consider using
 * `LiveRegionWrapper` instead.
 *
 * Docs: https://reactnative.dev/docs/accessibility#accessibilityliveregion-android
 */
export const useLiveRegionAnnouncement = (
  a11yLabel?: string,
  enabled?: boolean,
): AccessibilityProps => {
  // Since iOS does not support accessibilityLiveRegion, we trigger screen
  // reader announcements when a11yLabel changes for a equivalent effect.
  useEffect(() => {
    if (enabled && a11yLabel && Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibilityWithOptions(a11yLabel, {
        queue: true,
      });
    }
  }, [a11yLabel, enabled]);

  return {
    accessible: true,
    accessibilityLabel: a11yLabel,
    accessibilityLiveRegion: enabled ? 'polite' : undefined,
  };
};
