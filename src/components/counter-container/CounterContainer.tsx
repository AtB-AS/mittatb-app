import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {AccessibilityProps, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {iconSizes} from '@atb-as/theme';
import {TextNames} from '@atb/theme/colors';

interface StylingCounter {
  padding: number;
  lineHeight: number;
  type: TextNames;
}
export const CounterContainer = ({
  count,
  size = 'normal',
  style,
  ...a11yProps
}: {
  count: number;
  size?: keyof Theme['icon']['size'];
  style?: ViewStyle;
} & AccessibilityProps) => {
  const styles = useStyles();
  const {theme} = useTheme();

  if (count < 1) return null;

  const smallStyling: StylingCounter = {
    padding: theme.spacings.xSmall,
    lineHeight: iconSizes.small,
    type: 'label__uppercase',
  };

  const normalStyling: StylingCounter = {
    padding: theme.spacings.small,
    lineHeight: iconSizes.normal,
    type: 'body__primary--bold',
  };

  const largeStyling: StylingCounter = {
    padding: theme.spacings.small,
    lineHeight: iconSizes.large,
    type: 'body__primary--big',
  };

  const styling = (): StylingCounter => {
    switch (size) {
      case 'small':
        return smallStyling;
      case 'normal':
        return normalStyling;
      case 'large':
        return largeStyling;
    }
  };

  return (
    <View
      style={[
        styles.transportationIcon,
        style,
        {
          padding: styling().padding,
        },
      ]}
      {...a11yProps}
    >
      <ThemeText
        color={'transport_other'}
        type={styling().type}
        testID="counterBox"
        style={{
          lineHeight: styling().lineHeight,
        }}
      >
        +{count}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationIcon: {
    backgroundColor: theme.static.transport.transport_other.background,
    borderRadius: theme.border.radius.small,
  },
}));
