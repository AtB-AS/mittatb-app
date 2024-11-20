import type {AccessibilityProps} from 'react-native';

export type A11yLiveRegion = AccessibilityProps['accessibilityLiveRegion'];

export type A11yLiveRegionProps = Pick<
  AccessibilityProps,
  'accessible' | 'accessibilityLabel' | 'accessibilityLiveRegion'
>;
