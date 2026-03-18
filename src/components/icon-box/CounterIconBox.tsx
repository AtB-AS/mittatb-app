import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {TextNames} from '@atb/theme/colors';
import {useFontScale} from '@atb/utils/use-font-scale';
import {getIconBoxBorderRadius} from './utils';

const getTransportColor = (theme: Theme) => theme.color.transport.other;

export const CounterIconBox = ({
  count,
  textType,
  size = 'normal',
  spacing = 'compact',
  hideIfZero = true,
  style,
  ref,
}: {
  count: number;
  textType: TextNames;
  size?: keyof Theme['icon']['size'];
  spacing?: 'compact' | 'standard';
  hideIfZero?: boolean;
  style?: StyleProp<ViewStyle>;
  ref?: React.Ref<View>;
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const fontScale = useFontScale();
  const lineHeight = theme.icon.size[size];

  if (hideIfZero && count < 1) return null;

  return (
    <View
      style={[
        styles.counterContainer,
        style,
        {
          padding:
            spacing === 'compact' ? theme.spacing.xSmall : theme.spacing.small,
          borderRadius: getIconBoxBorderRadius(size, theme),
        },
      ]}
      importantForAccessibility="no-hide-descendants"
      ref={ref}
    >
      <ThemeText
        color={getTransportColor(theme).secondary}
        typography={textType}
        testID="tripLegMore"
        style={{
          height: lineHeight * fontScale,
          minWidth: lineHeight * fontScale,
          lineHeight: lineHeight,
          textAlign: 'center',
        }}
      >
        +{count}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  counterContainer: {
    backgroundColor: getTransportColor(theme).primary.background,
  },
}));
