import {useTheme} from '@atb/theme';
import {
  flatStaticColors,
  isStaticColor,
  isStatusColor,
  Mode,
  Theme,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import {useFontScale} from '@atb/utils/use-font-scale';
import {View} from 'react-native';
import type {IconColor} from './types';
import {
  NotificationIndicator,
  NotificationIndicatorProps,
} from './NotificationIndicator';
import React from 'react';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils.ts';

export type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: IconColor;
  size?: keyof Theme['icon']['size'];
  notification?: Omit<NotificationIndicatorProps, 'iconSize'>;
  allowFontScaling?: boolean;
} & SvgProps;

export const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  fill,
  notification,
  style,
  allowFontScaling = true,
  ...props
}: ThemeIconProps): JSX.Element | null => {
  const {theme, themeName} = useTheme();
  const fontScale = useFontScale();

  if (!svg) {
    notifyBugsnag('Undefined SVG provided to ThemeIcon');
    return null;
  }

  const fillToUse = fill || getFill(theme, themeName, colorType);

  const iconSize = allowFontScaling
    ? theme.icon.size[size] * fontScale
    : theme.icon.size[size];

  const settings = {
    fill: fillToUse,
    height: iconSize,
    width: iconSize,
    ...props,
  };

  return (
    <View style={style}>
      <>
        {svg(settings)}
        {notification && (
          <NotificationIndicator {...notification} iconSize={size} />
        )}
      </>
    </View>
  );
};

function getFill(theme: Theme, themeType: Mode, colorType?: IconColor): string {
  if (colorType && typeof colorType !== 'string') {
    return colorType.text;
  } else if (isStatusColor(colorType)) {
    return theme.status[colorType].primary.background;
  } else if (isStaticColor(colorType)) {
    return flatStaticColors[themeType][colorType].text;
  } else {
    return theme.text.colors[colorType ?? 'primary'];
  }
}
