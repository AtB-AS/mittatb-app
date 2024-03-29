import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {iconSizes} from '@atb-as/theme';
import {getTransportationColor, TextNames} from '@atb/theme/colors';

interface CounterStyling {
  padding: number;
  lineHeight: number;
  type: TextNames;
}
export const CounterIconBox = ({
  count,
  size = 'normal',
  style,
  ...a11yProps
}: {
  count: number;
  size?: keyof Theme['icon']['size'];
  style?: StyleProp<ViewStyle>;
} & AccessibilityProps) => {
  const styles = useStyles();
  const {theme, themeName} = useTheme();

  if (count < 1) return null;

  const xSmallStyling: CounterStyling = {
    padding: theme.spacings.xSmall,
    lineHeight: iconSizes.xSmall,
    type: 'label__uppercase',
  };

  const smallStyling: CounterStyling = {
    padding: theme.spacings.xSmall,
    lineHeight: iconSizes.small,
    type: 'label__uppercase',
  };

  const normalStyling: CounterStyling = {
    padding: theme.spacings.small,
    lineHeight: iconSizes.normal,
    type: 'body__primary--bold',
  };

  const largeStyling: CounterStyling = {
    padding: theme.spacings.small,
    lineHeight: iconSizes.large,
    type: 'body__primary--big',
  };

  const styling = (): CounterStyling => {
    switch (size) {
      case 'xSmall':
        return xSmallStyling;
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
        styles.counterContainer,
        style,
        {
          padding: styling().padding,
        },
      ]}
      {...a11yProps}
    >
      <ThemeText
        color={getTransportationColor(
          themeName,
          'transport_other',
          'secondary',
        )}
        type={styling().type}
        testID="tripLegMore"
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
  counterContainer: {
    backgroundColor: theme.transport.transport_other.primary.background,
    borderRadius: theme.border.radius.small,
  },
}));
