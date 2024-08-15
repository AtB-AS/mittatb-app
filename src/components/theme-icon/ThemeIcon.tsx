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
  size?: keyof Theme['Icon']['Size'];
  notification?: Omit<NotificationIndicatorProps, 'iconSize'>;
  allowFontScaling?: boolean;
} & SvgProps;

export const ThemeIcon = ({
  svg,
  colorType,
  size = "Medium",
  fill,
  notification,
  style,
  allowFontScaling = true,
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme} = useTheme();

  const fillToUse = fill || colorType?.Background;

  const fontScale = useFontScale();
  const iconSize = allowFontScaling
    ? theme.Icon.Size[size] * fontScale
    : theme.Icon.Size[size];

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
