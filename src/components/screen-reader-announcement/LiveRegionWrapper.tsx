import {View} from 'react-native';
import {useLiveRegionAnnouncement} from './use-live-region-announcement';
import type {A11yLiveRegion} from './types';

/**
 * Wrapper for components that should be announced to screen readers on mount
 * and when the a11yLabel changes. For interactive components, use
 * `useLiveRegionAnnouncement` directly.
 */
export const LiveRegionWrapper = ({
  accessibilityLabel,
  a11yLiveRegion = 'polite',
  children,
}: {
  accessibilityLabel: string;
  a11yLiveRegion?: A11yLiveRegion;
  children: React.ReactNode;
}) => {
  const a11yProps = useLiveRegionAnnouncement(
    accessibilityLabel,
    a11yLiveRegion,
  );
  return <View {...a11yProps}>{children}</View>;
};
