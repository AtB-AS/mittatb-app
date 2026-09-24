import React, {PropsWithChildren} from 'react';
import {StyleProp, View, ViewProps, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ShimmerBand} from './ShimmerBand';

type Props = PropsWithChildren<
  ViewProps & {
    style?: StyleProp<ViewStyle>;
    /** Highlight color swept across the content. Defaults to white. */
    highlightColor?: string;
  }
>;

/**
 * A shimmering skeleton placeholder shown while content loads.
 *
 * - With no children it renders a single shimmering block shaped by `style` —
 *   the common one-import case.
 * - With children it sweeps a single shared shimmer across whatever you compose
 *   inside (e.g. `SkeletonBlock` shapes), for building richer skeletons.
 *
 * Every Skeleton on screen shares a single native-driven sweep, so adding more
 * skeletons doesn't add more animations to drive.
 */
export const Skeleton = ({
  children,
  style,
  highlightColor,
  ...viewProps
}: Props) => {
  const styles = useStyles();

  return (
    <View
      style={[styles.container, !children && styles.block, style]}
      {...viewProps}
    >
      {children}
      <ShimmerBand highlightColor={highlightColor} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    overflow: 'hidden',
  },
  // Applied only when the Skeleton is a standalone block (no children).
  block: {
    backgroundColor: theme.color.background.neutral[3].background,
  },
}));
