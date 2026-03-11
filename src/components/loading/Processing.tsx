import React from 'react';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import {Loading} from './Loading';

const getThemeColor = (theme: Theme) => theme.color.background.neutral[0];

export const Processing: React.FC<{message: string}> = ({message}) => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Loading style={styles.indicator} />
      <ThemeText>{message}</ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.large,
    borderRadius: theme.border.radius.regular,
    margin: theme.spacing.xLarge,
    alignItems: 'center',
  },
  indicator: {
    margin: theme.spacing.small,
  },
}));
