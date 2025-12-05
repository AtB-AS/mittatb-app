import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import _ from 'lodash';
import React from 'react';

type PageIndicatorProps = {
  index: number;
  count: number;
};

export function PageIndicator({index, count}: PageIndicatorProps) {
  const styles = useThemeStyles();
  return (
    <View style={styles.pageIndicator}>
      {_.times(count, (i) => (
        <View
          key={i}
          style={[styles.pageDot, index === i && styles.activeDot]}
        />
      ))}
    </View>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacing.medium,
  },
  pageDot: {
    height: theme.spacing.medium,
    width: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium / 2,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.color.background.neutral[0].background,
  },
  activeDot: {
    backgroundColor: theme.color.interactive[0].default.background,
  },
}));
