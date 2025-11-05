import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {TextNames} from '@atb/theme/colors';
import {useFontScale} from '@atb/utils/use-font-scale';

const getTransportColor = (theme: Theme) => theme.color.transport.other;

export const CounterIconBox = ({
  count,
  textType,
  size = 'normal',
  spacing = 'compact',
  style,
}: {
  count: number;
  textType: TextNames;
  size?: keyof Theme['icon']['size'];
  spacing?: 'compact' | 'standard';
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const fontScale = useFontScale();
  const lineHeight = theme.icon.size[size];

  if (count < 1) return null;

  return (
    <View
      style={[
        styles.counterContainer,
        style,
        {
          padding:
            spacing === 'compact' ? theme.spacing.xSmall : theme.spacing.small,
        },
      ]}
      importantForAccessibility="no-hide-descendants"
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
    borderRadius: theme.border.radius.regular,
  },
}));
