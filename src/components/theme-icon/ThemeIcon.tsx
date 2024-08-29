import {useTheme} from '@atb/theme';
import {
  ContrastColor,
  TextColor,
  Theme,
  useColor,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import {useFontScale} from '@atb/utils/use-font-scale';
import {ColorValue, View} from 'react-native';
import {
  NotificationIndicator,
  NotificationIndicatorProps,
} from './NotificationIndicator';
import React from 'react';

export type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  color?: ContrastColor | TextColor | ColorValue;
  size?: keyof Theme['icon']['size'];
  notification?: Omit<NotificationIndicatorProps, 'iconSize'>;
  allowFontScaling?: boolean;
} & Omit<SvgProps, 'color' | 'fill'>;

export const ThemeIcon = ({
  svg,
  color,
  size = "medium",
  notification,
  style,
  allowFontScaling = true,
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme} = useTheme();
  const fill = useColor(color)

  const fontScale = useFontScale();
  const iconSize = allowFontScaling
    ? theme.icon.size[size] * fontScale
    : theme.icon.size[size];

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
