import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {getTransportModeSvg} from './utils';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {getTransportationColor} from '@atb/theme/colors';

export type TransportationIconBoxProps = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  isFlexible?: boolean;
  lineNumber?: string;
  size?: keyof Theme['icon']['size'];
  type?: 'compact' | 'standard';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
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
  testID,
}) => {
  const {t} = useTranslation();
  const {theme, themeName} = useTheme();
  const themeColor = useThemeColorForTransportMode(mode, subMode, isFlexible);
  const transportationColor = getTransportationColor(themeName, themeColor);
  const backgroundColor = disabled
    ? theme.text.colors.disabled
    : transportationColor.background;
  const {svg} = getTransportModeSvg(mode, subMode);
  const styles = useStyles();

  const lineNumberElement = lineNumber ? (
    <ThemeText
      type="body__primary--bold"
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
        },
      ]}
    >
      <ThemeIcon
        size={size}
        svg={svg}
        fill={transportationColor.text}
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
    padding: theme.spacings.xSmall,
    borderRadius: theme.border.radius.small,
  },
  standardTransportationIconBox: {
    padding: theme.spacings.small,
  },
  lineNumberText: {
    marginLeft: theme.spacings.xSmall,
  },
}));
