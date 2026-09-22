import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {SkeletonBlock} from '@atb/components/skeleton';

const PILL_COUNT = 4;

export const LegsSkeleton = () => {
  const styles = useStyles();

  return (
    <View
      style={styles.row}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({length: PILL_COUNT}, (_, i) => (
        <SkeletonBlock key={i} style={styles.pill} />
      ))}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme, _, {fontScale}) => ({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
  },
  // Stadium shape and height matching the transport-mode boxes (icon + padding).
  pill: {
    width: theme.icon.size.normal * 2 + theme.spacing.small * 2,
    height: theme.icon.size.normal * fontScale + theme.spacing.small * 2,
    borderRadius: theme.border.radius.circle,
  },
}));
