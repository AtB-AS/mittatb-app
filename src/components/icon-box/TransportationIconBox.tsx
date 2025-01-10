import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useThemeColorForTransportMode} from '@atb/utils/use-transport-color';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {getTransportModeSvg} from './utils';
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
  const {theme} = useThemeContext();
  const themeColor = useThemeColorForTransportMode(mode, subMode, isFlexible);
  const transportationColor = theme.color.transport[themeColor].primary;
  const backgroundColor = disabled
    ? transportationColor.foreground.disabled
    : transportationColor.background;
  const {svg} = getTransportModeSvg(mode, subMode);
  const styles = useStyles();

  const lineNumberElement = lineNumber ? (
    <ThemeText
      typography="body__primary--bold"
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
    borderRadius: theme.border.radius.small,
  },
  standardTransportationIconBox: {
    padding: theme.spacing.small,
  },
  lineNumberText: {
    marginLeft: theme.spacing.xSmall,
  },
}));
