import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {Skeleton, SkeletonBlock} from '@atb/components/skeleton';
import {LegsSkeleton} from './LegsSkeleton';

/**
 * Layout is duplicated from TravelCard / TravelCardHeader — there is no shared
 * style, so keep them aligned if either layout changes.
 */
export const TravelCardSkeleton = () => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  return (
    <Skeleton
      style={styles.container}
      accessible={true}
      accessibilityLabel={t(TravelCardTexts.skeleton.a11yLabel)}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <SkeletonBlock style={styles.timeBlock} />
          <SkeletonBlock style={styles.durationBlock} />
        </View>
        <LegsSkeleton />
      </View>
    </Skeleton>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[0].background,
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
  },
  content: {
    gap: theme.spacing.medium,
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
}));
