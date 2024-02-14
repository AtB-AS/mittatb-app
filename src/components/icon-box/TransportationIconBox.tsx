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
  lineNumber?: string;
  size?: keyof Theme['icon']['size'];
  spacious?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
};

export const TransportationIconBox: React.FC<TransportationIconBoxProps> = ({
  mode,
  subMode,
  lineNumber,
  size = 'normal',
  spacious = false,
  style,
  disabled,
  testID,
}) => {
  const {t} = useTranslation();
  const {theme, themeName} = useTheme();
  const themeColor = useThemeColorForTransportMode(mode, subMode);
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
      testID={testID}
    >
      {lineNumber}
    </ThemeText>
  ) : null;

  return (
    <View
      style={[
        styles.transportationIconBox,
        spacious && styles.spaciousTransportationIconBox,
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
  spaciousTransportationIconBox: {
    padding: theme.spacings.small,
  },
  lineNumberText: {
    marginLeft: theme.spacings.xSmall,
  },
}));
