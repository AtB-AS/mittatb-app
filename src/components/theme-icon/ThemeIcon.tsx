import {useThemeContext} from '@atb/theme';
import {
  ContrastColor,
  Statuses,
  TextColor,
  Theme,
  resolveColorValue,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import {useFontScale} from '@atb/utils/use-font-scale';
import {ColorValue, View} from 'react-native';
import {
  NotificationIndicator,
  NotificationIndicatorProps,
} from './NotificationIndicator';
import React from 'react';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

export type IconColor = ContrastColor | TextColor | Statuses | ColorValue;
export type ThemeIconProps = {
  svg(props: SvgProps): React.JSX.Element;
  color?: IconColor;
  size?: keyof Theme['icon']['size'];
  customSize?: number;
  notification?: Omit<NotificationIndicatorProps, 'iconSize'>;
  allowFontScaling?: boolean;
} & Omit<SvgProps, 'color' | 'fill'>;

export const ThemeIcon = ({
  svg: SvgComponent,
  color,
  size = 'normal',
  customSize,
  notification,
  style,
  allowFontScaling = true,
  ...props
}: ThemeIconProps): React.JSX.Element | null => {
  const {theme} = useThemeContext();
  const fontScale = useFontScale();
  const fill = resolveColorValue(color, 'primary', theme);

  if (!SvgComponent) {
    notifyBugsnag('Undefined SVG provided to ThemeIcon');
    return null;
  }

  const unscaledIconSize = customSize ?? theme.icon.size[size];

  const iconSize = allowFontScaling
    ? unscaledIconSize * fontScale
    : unscaledIconSize;

  const settings = {
    fill,
    height: iconSize,
    width: iconSize,
    ...props,
  };

  return (
    <View style={style}>
      <SvgComponent {...settings} />
      {notification && (
        <NotificationIndicator {...notification} iconSize={size} />
      )}
    </View>
  );
};
