import React, {PropsWithChildren} from 'react';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {StyleProp, TextStyle} from 'react-native';

type Props = PropsWithChildren<{
  accessibilityLabel?: string | undefined;
}>;
export const SectionHeading = ({accessibilityLabel, children}: Props) => {
  const style = useStyle();
  return (
    <ThemeText
      type="body__secondary"
      color="background_accent_0"
      style={style.heading}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </ThemeText>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  heading: {
    marginBottom: theme.spacings.medium,
  },
}));
