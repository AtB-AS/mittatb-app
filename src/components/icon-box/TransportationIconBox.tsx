import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {getIconBoxBorderRadius, getTransportModeSvg} from './utils';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';

export type TransportationIconBoxProps = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  isFlexible?: boolean;
  lineNumber?: string;
  size?: keyof Theme['icon']['size'];
  type?: 'compact' | 'standard';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  overrideBorderRadius?: string;
  testID?: string;
};

export const TransportationIconBox: React.FC<TransportationIconBoxProps> = ({
  mode,
  subMode,
  isFlexible = false,
  lineNumber,
  size = 'normal',
  type = 'compact',
  style,
  disabled,
  overrideBorderRadius,
  testID,
}) => {
  const {t} = useTranslation();
  const transportColor = useTransportColor(mode, subMode, isFlexible);
  const transportationColor = transportColor.primary;
  const backgroundColor = disabled
    ? transportationColor.foreground.disabled
    : transportationColor.background;
  const {svg} = getTransportModeSvg(mode, subMode);
  const styles = useStyles();
  const {theme} = useThemeContext();

  const lineNumberElement = lineNumber ? (
    <ThemeText
      typography="body__m__strong"
      color={transportationColor}
      style={styles.lineNumberText}
      testID="lineNumber"
    >
      {lineNumber}
    </ThemeText>
  ) : null;

  return (
    <View
      style={[
        styles.transportationIconBox,
        type === 'standard' && styles.standardTransportationIconBox,
        style,
        {
          backgroundColor,
          borderRadius:
            overrideBorderRadius ?? getIconBoxBorderRadius(size, theme),
        },
      ]}
    >
      <ThemeIcon
        size={size}
        svg={svg}
        color={transportationColor.foreground.primary}
        accessibilityLabel={t(getTranslatedModeName(mode))}
        testID={testID}
      />
      {lineNumberElement}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationIconBox: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.xSmall,
  },
  standardTransportationIconBox: {
    padding: theme.spacing.small,
  },
  lineNumberText: {
    marginLeft: theme.spacing.xSmall,
  },
}));
