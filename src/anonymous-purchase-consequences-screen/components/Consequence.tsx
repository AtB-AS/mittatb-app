import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {Theme} from '@atb-as/theme';

const getThemeColor = (theme: Theme) => theme.background.accent[0];
const getAccentColor = (theme: Theme) => theme.background.accent[1];

export const Consequence = ({
  value,
  icon,
}: {
  value: string;
  icon: JSX.Element;
}) => {
  const styles = useStyle();
  const { theme } = useTheme()
  return (
    <View style={styles.consequence}>
      <View style={styles.icon}>{icon}</View>
      <ThemeText style={styles.description} color={getThemeColor(theme)}>
        {value}
      </ThemeText>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  description: {
    paddingHorizontal: theme.spacing.medium,
    flex: 1,
  },
  icon: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.medium,
  },
  consequence: {
    backgroundColor: getAccentColor(theme).background,
    borderRadius: theme.border.radius.medium,
    marginTop: theme.spacing.medium,
    flexDirection: 'row',
    padding: theme.spacing.medium,
  },
}));
