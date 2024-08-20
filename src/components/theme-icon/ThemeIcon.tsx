import {useTheme} from '@atb/theme';
import {
  ContrastColor,
  Theme,
} from '@atb/theme/colors';
import {SvgProps} from 'react-native-svg';
import {useFontScale} from '@atb/utils/use-font-scale';
import {View} from 'react-native';
import {
  NotificationIndicator,
  NotificationIndicatorProps,
} from './NotificationIndicator';
import React from 'react';

export type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: ContrastColor;
  size?: keyof Theme['icon']['size'];
  notification?: Omit<NotificationIndicatorProps, 'iconSize'>;
  allowFontScaling?: boolean;
} & SvgProps;

export const ThemeIcon = ({
  svg,
  colorType,
  size = "medium",
  fill,
  notification,
  style,
  allowFontScaling = true,
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme} = useTheme();

  const fillToUse = fill || colorType?.background;

  const fontScale = useFontScale();
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
