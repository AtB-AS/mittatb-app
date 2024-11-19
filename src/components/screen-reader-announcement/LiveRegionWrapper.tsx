import {View} from 'react-native';
import {useLiveRegionAnnouncement} from './use-live-region-announcement';

/**
 * Wrapper for components that should be announced to screen readers on mount
 * and when the a11yLabel changes. For interactive components, use
 * `useLiveRegionAnnouncement` directly.
 */
export const LiveRegionWrapper = ({
  accessibilityLabel,
  children,
}: {
  accessibilityLabel: string;
  children: React.ReactNode;
}) => {
  const a11yProps = useLiveRegionAnnouncement(accessibilityLabel, true);
  return <View {...a11yProps}>{children}</View>;
};
