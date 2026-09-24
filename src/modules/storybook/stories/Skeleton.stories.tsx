import React from 'react';
import {ScrollView, View} from 'react-native';
import {Skeleton, SkeletonBlock} from '@atb/components/skeleton';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {Meta} from '@storybook/react';
import {
  ThemedStoryDecorator,
  ThemedStoryProps,
  themedStoryControls,
  themedStoryDefaultArgs,
} from '../ThemedStoryDecorator';

type SkeletonMetaProps = ThemedStoryProps<{}>;

const SkeletonMeta: Meta = {
  title: 'Skeleton',
  component: Skeleton,
  argTypes: {
    ...themedStoryControls,
  },
  args: {
    ...themedStoryDefaultArgs,
    storyColor: 'background neutral 1',
  },
  decorators: [ThemedStoryDecorator as any],
};

export default SkeletonMeta;

const SkeletonStory = (_args: SkeletonMetaProps) => {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemeText typography="heading__m">Standalone block</ThemeText>
      <ThemeText typography="body__s" style={styles.caption}>
        A single shimmering block — just give it a size.
      </ThemeText>
      <Skeleton style={styles.line} />
      <Skeleton style={styles.lineShort} />
      <Skeleton style={styles.pill} />

      <ThemeText typography="heading__m" style={styles.sectionSpacing}>
        Composed skeleton
      </ThemeText>
      <ThemeText typography="body__s" style={styles.caption}>
        Compose SkeletonBlocks inside a Skeleton for one shared sweep.
      </ThemeText>
      <Skeleton style={styles.card}>
        <View style={styles.cardHeader}>
          <SkeletonBlock style={styles.title} />
          <SkeletonBlock style={styles.badge} />
        </View>
        <View style={styles.row}>
          <SkeletonBlock style={styles.pillSmall} />
          <SkeletonBlock style={styles.pillSmall} />
          <SkeletonBlock style={styles.pillSmall} />
        </View>
      </Skeleton>
    </ScrollView>
  );
};

export const Default = {
  render: SkeletonStory,
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacing.medium,
    gap: theme.spacing.small,
  },
  caption: {
    marginBottom: theme.spacing.small,
  },
  sectionSpacing: {
    marginTop: theme.spacing.large,
  },
  line: {
    height: 16,
    borderRadius: theme.border.radius.small,
  },
  lineShort: {
    width: '60%',
    height: 16,
    borderRadius: theme.border.radius.small,
  },
  pill: {
    width: 120,
    height: 32,
    borderRadius: theme.border.radius.circle,
  },
  card: {
    gap: theme.spacing.medium,
    backgroundColor: theme.color.background.neutral[0].background,
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    width: 140,
    height: 18,
    borderRadius: theme.border.radius.small,
  },
  badge: {
    width: 48,
    height: 18,
    borderRadius: theme.border.radius.small,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
  },
  pillSmall: {
    width: 56,
    height: 32,
    borderRadius: theme.border.radius.circle,
  },
}));
