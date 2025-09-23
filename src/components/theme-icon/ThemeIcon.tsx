import {useThemeContext} from '@atb/theme';
import {
  ContrastColor,
  Statuses,
  TextColor,
  Theme,
  isStatusColor,
  isTextColor,
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
  svg,
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
  const fill = useColor(color);

  if (!svg) {
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
      <>
        {svg(settings)}
        {notification && (
          <NotificationIndicator {...notification} iconSize={size} />
        )}
      </>
    </View>
  );
};

function useColor(color?: IconColor) {
  const {theme} = useThemeContext();
  if (typeof color === 'object') {
    return color.foreground.primary;
  } else if (isStatusColor(color, theme)) {
    return theme.color.status[color].primary.background;
  } else if (isTextColor(color, theme) || color === undefined) {
    return theme.color.foreground.dynamic[color ?? 'primary'];
  } else {
    return color;
  }
}
