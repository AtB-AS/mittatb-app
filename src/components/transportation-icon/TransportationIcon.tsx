import React from 'react';
import {View} from 'react-native';

import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {getTransportModeSvg} from './utils';
import {AnyMode, AnySubMode} from '@atb/components/transportation-icon/types';

export type TransportationIconProps = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  lineNumber?: string;
  size?: keyof Theme['icon']['size'];
  wide?: boolean;
  disabled?: boolean;
};

export const TransportationIcon: React.FC<TransportationIconProps> = ({
  mode,
  subMode,
  lineNumber,
  size = 'normal',
  wide,
  disabled,
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
      ? styles.transportationIcon_small
      : styles.transportationIcon;
  const minWidth = wide ? styles.transportationIcon_wide : undefined;
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
        minWidth,
        {
          backgroundColor,
          justifyContent: 'center',
        },
      ]}
    >
      <ThemeIcon
        size={size}
        svg={svg}
        colorType={themeColor}
        accessibilityLabel={t(getTranslatedModeName(mode))}
      />
      {lineNumberElement}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationIcon: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.small,
    marginRight: theme.spacings.xSmall,
  },
  transportationIcon_small: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacings.xSmall,
    paddingHorizontal: theme.spacings.xSmall,
    borderRadius: theme.border.radius.small,
    marginRight: theme.spacings.xSmall,
  },
  transportationIcon_wide: {
    minWidth: theme.tripLegDetail.labelWidth,
  },
  lineNumberText: {
    marginLeft: theme.spacings.xSmall,
  },
}));
