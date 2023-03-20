import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {iconSizes} from '@atb-as/theme';
import {TextNames} from '@atb/theme/colors';

interface StylingCounter {
  padding: number;
  lineHeight: number;
  type: TextNames;
}
export const CounterBox = ({
  count,
  size = 'normal',
  accessibilityLabel,
}: {
  count: number;
  size?: keyof Theme['icon']['size'];
  accessibilityLabel?: string;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  if (count < 1) return null;
  const isSmall: boolean = size === 'small';

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

  const styling = isSmall ? smallStyling : normalStyling;

  return (
    <View
      style={[
        styles.transportationIcon,
        {
          padding: styling.padding,
        },
      ]}
    >
      <ThemeText
        color={'transport_other'}
        type={styling.type}
        testID="counterBox"
        accessibilityLabel={accessibilityLabel}
        style={{
          lineHeight: styling.lineHeight,
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
