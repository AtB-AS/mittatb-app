import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {TravelCardTexts, useTranslation} from '@atb/translations';
import {LegsSkeleton} from './LegsSkeleton';
import {SkeletonBlock} from './SkeletonBlock';

/**
 * Layout is duplicated from TravelCard / TravelCardHeader — there is no shared
 * style, so keep them aligned if either layout changes.
 */
export const TravelCardSkeleton = () => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={t(TravelCardTexts.skeleton.a11yLabel)}
    >
      <View style={styles.header}>
        <SkeletonBlock style={styles.timeBlock} />
        <SkeletonBlock style={styles.durationBlock} />
      </View>
      <LegsSkeleton />
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
}));
