import {useEffect} from 'react';
import {AccessibilityInfo, Platform} from 'react-native';
import type {A11yLiveRegion, A11yLiveRegionProps} from './types';

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
  a11yLiveRegion?: A11yLiveRegion,
): A11yLiveRegionProps => {
  // Since iOS does not support accessibilityLiveRegion, we trigger screen
  // reader announcements when a11yLabel changes for a equivalent effect.
  useEffect(() => {
    const enabled =
      a11yLiveRegion === 'polite' || a11yLiveRegion === 'assertive';
    if (enabled && a11yLabel && Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibilityWithOptions(a11yLabel, {
        queue: a11yLiveRegion === 'polite',
      });
    }
  }, [a11yLabel, a11yLiveRegion]);

  return {
    accessible: true,
    accessibilityLabel: a11yLabel,
    accessibilityLiveRegion: a11yLiveRegion,
  };
};
