import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {LegsSkeleton} from './legs';
import {SkeletonBlock} from './SkeletonBlock';

/**
 * Layout is duplicated from TravelCard / TravelCardHeader — there is no shared
 * style, so keep them aligned if either layout changes.
 */
export const TravelCardSkeleton = () => {
  const styles = useThemeStyles();
  return (
    <View
      style={styles.container}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.header}>
        <SkeletonBlock style={styles.timeBlock} />
        <SkeletonBlock style={styles.durationBlock} />
      </View>
      <View style={styles.legsContainer}>
        <View style={styles.legsArea}>
          <LegsSkeleton />
        </View>
        <ThemeIcon svg={ChevronRight} color="secondary" />
      </View>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    gap: theme.spacing.medium,
    backgroundColor: theme.color.background.neutral[0].background,
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeBlock: {
    width: 120,
    height: 18,
    borderRadius: theme.border.radius.small,
  },
  durationBlock: {
    width: 48,
    height: 16,
    borderRadius: theme.border.radius.small,
  },
  legsContainer: {
    gap: theme.spacing.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legsArea: {
    flex: 1,
  },
}));
