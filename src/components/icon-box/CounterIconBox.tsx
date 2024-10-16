import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {getTransportationColor, TextNames} from '@atb/theme/colors';
import {useFontScale} from '@atb/utils/use-font-scale';

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
  const {theme, themeName} = useTheme();
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
            spacing === 'compact'
              ? theme.spacings.xSmall
              : theme.spacings.small,
        },
      ]}
      importantForAccessibility="no-hide-descendants"
    >
      <ThemeText
        color={getTransportationColor(
          themeName,
          'transport_other',
          'secondary',
        )}
        type={textType}
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
    backgroundColor: theme.transport.transport_other.primary.background,
    borderRadius: theme.border.radius.small,
  },
}));
