import React, {PropsWithChildren} from 'react';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';

type Props = PropsWithChildren<{
  accessibilityLabel?: string | undefined;
}>;
export const SectionHeading = ({accessibilityLabel, children}: Props) => {
  const style = useStyle();
  const {theme} = useTheme()
  const themeColor = theme.color.background.accent[0];
  return (
    <ThemeText
      type="body__secondary"
      color={themeColor}
      style={style.heading}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </ThemeText>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  heading: {
    marginBottom: theme.spacing.medium,
  },
}));
