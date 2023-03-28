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

export type TransportationIconBoxProps = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  lineNumber?: string;
  size?: keyof Theme['icon']['size'];
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
};

export const TransportationIconBox: React.FC<TransportationIconBoxProps> = ({
  mode,
  subMode,
  lineNumber,
  size = 'normal',
  style,
  disabled,
  testID,
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const themeColor = useThemeColorForTransportMode(mode, subMode);
  const backgroundColor = disabled
    ? theme.text.colors.disabled
    : theme.static.transport[themeColor].background;
  const svg = getTransportModeSvg(mode, subMode);
  const styles = useStyles();

  const iconStyle =
    size == 'small'
      ? styles.transportationIconBox_small
      : styles.transportationIconBox;
  const lineNumberElement = lineNumber ? (
    <ThemeText
      type="body__primary--bold"
      color={themeColor}
      style={styles.lineNumberText}
    >
      {lineNumber}
    </ThemeText>
  ) : null;

  return (
    <View
      style={[
        iconStyle,
        style,
        {
          backgroundColor,
        },
      ]}
    >
      <ThemeIcon
        size={size}
        svg={svg}
        colorType={themeColor}
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
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.small,
  },
  transportationIconBox_small: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacings.xSmall,
    paddingHorizontal: theme.spacings.xSmall,
    borderRadius: theme.border.radius.small,
  },
  lineNumberText: {
    marginLeft: theme.spacings.xSmall,
  },
}));
